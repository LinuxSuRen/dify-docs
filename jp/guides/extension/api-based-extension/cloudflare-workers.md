# Cloudflare ワーカーを使用して API ツールをデプロイ

## 始めに

Dify API Extension は、アクセス可能な公開アドレスを API エンドポイントとして使用する必要があるため、API 拡張を公開アドレスにデプロイする必要があります。ここでは、Cloudflare ワーカーを使用して API 拡張をデプロイします。

まず、[サンプル GitHub リポジトリ](https://github.com/crazywoola/dify-extension-workers) をクローンします。このリポジトリには、簡単な API 拡張が含まれており、これを基にして修正を行うことができます。

```bash
git clone https://github.com/crazywoola/dify-extension-workers.git
cp wrangler.toml.example wrangler.toml
```

次に、`wrangler.toml` ファイルを開き、`name` と `compatibility_date` をあなたのアプリ名と互換日付に変更します。

ここで注意が必要な設定は、`vars` 内の `TOKEN` です。Dify に API 拡張を追加する際に、このトークンを入力する必要があります。セキュリティ上の観点から、ランダムな文字列をトークンとして使用することをお勧めします。トークンをソースコードに直接書き込むのではなく、環境変数を使用してトークンを渡す方法を取るべきです。したがって、wrangler.toml をコードリポジトリにコミットしないでください。

```toml
name = "dify-extension-example"
compatibility_date = "2023-01-01"

[vars]
TOKEN = "bananaiscool"
```

この API 拡張は、ランダムなブレイキング・バッドの名言を返します。`src/index.ts` 内でこの API 拡張のロジックを変更することができます。この例は、サードパーティの API とやり取りする方法を示しています。

```typescript
// ⬇️ ここにロジックを実装 ⬇️
// point === "app.external_data_tool.query"
// https://api.breakingbadquotes.xyz/v1/quotes
const count = params?.inputs?.count ?? 1;
const url = `https://api.breakingbadquotes.xyz/v1/quotes/${count}`;
const result = await fetch(url).then(res => res.text())
// ⬆️ ここにロジックを実装 ⬆️
```

このリポジトリは、ビジネスロジック以外のすべての設定を簡素化しています。`npm` コマンドを使用して API 拡張をデプロイすることができます。

```bash
npm install
npm run deploy
```

デプロイが成功すると、公開アドレスが得られます。このアドレスを Dify に API エンドポイントとして追加できます。`endpoint` パスを忘れないようにしてください。この経路の具体的な定義は `src/index.ts` で確認できます。

<figure><img src="../../../.gitbook/assets/api_extension_edit.png" alt=""><figcaption><p>Dify に API エンドポイントを追加する</p></figcaption></figure>

<figure><img src="../../../.gitbook/assets/app_tools_edit.png" alt=""><figcaption><p>アプリ編集ページに API ツールを追加する</p></figcaption></figure>

また、`npm run dev` コマンドを使用してローカルにデプロイし、テストすることもできます。

```bash
npm install
npm run dev
```

関連する出力：

```bash
$ npm run dev
> dev
> wrangler dev src/index.ts

 ⛅️ wrangler 3.99.0
-------------------

Your worker has access to the following bindings:
- Vars:
  - TOKEN: "ban****ool"
⎔ Starting local server...
[wrangler:inf] Ready on http://localhost:58445
```

その後、Postman などのツールを使用してローカルインターフェースをデバッグできます。

## その他のロジック TL;DR

### Bearer 認証について

```typescript
import { bearerAuth } from "hono/bearer-auth";

(c, next) => {
    const auth = bearerAuth({ token: c.env.TOKEN });
    return auth(c, next);
},
```

上記のコードでは、Bearer 認証ロジックを示しています。`hono/bearer-auth` パッケージを使用して Bearer 認証を実装しています。`src/index.ts` で `c.env.TOKEN` を使用してトークンを取得できます。

### パラメータの検証について

```typescript
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const schema = z.object({
  point: z.union([
    z.literal("ping"),
    z.literal("app.external_data_tool.query"),
  ]), // 'point' を2つの特定の値に制限
  params: z
    .object({
      app_id: z.string().optional(),
      tool_variable: z.string().optional(),
      inputs: z.record(z.any()).optional(),
      query: z.any().optional(),  // 文字列または null
    })
    .optional(),
});

```

ここでは、`zod` を使用してパラメータのタイプを定義しています。`src/index.ts` で `zValidator` を使用してパラメータを検証できます。`const { point, params } = c.req.valid("json");` を使用して検証後のパラメータを取得します。`point` は2つの値しか持たないため、`z.union` を使用して定義しています。`params` はオプションのため、`z.optional` を使用して定義しています。この中には `inputs` パラメータがあり、これは `Record<string, any>` 型です。この型はキーが文字列で値が任意のオブジェクトを示します。`src/index.ts` で `params?.inputs?.count` を使用して `count` パラメータを取得できます。

### Cloudflare ワーカーのログを取得する

```bash
wrangler tail
```

## 参考内容

* [Cloudflare Workers](https://workers.cloudflare.com/)
* [Cloudflare Workers CLI](https://developers.cloudflare.com/workers/cli-wrangler/install-update)
* [サンプル GitHub リポジトリ](https://github.com/crazywoola/dify-extension-workers)