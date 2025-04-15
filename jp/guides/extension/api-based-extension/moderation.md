# 敏感内容審査

このモジュールは、アプリケーションにおける端末ユーザーの入力内容とLLM（大規模言語モデル）の出力内容を審査するために使用され、2つの拡張点タイプに分かれています。

### 拡張点 <a href="#usercontent-kuo-zhan-dian" id="usercontent-kuo-zhan-dian"></a>

* `app.moderation.input` 端末ユーザー入力内容の審査拡張点
  * 端末ユーザーが送信した変数の内容や対話型アプリケーションにおける対話の入力内容を審査するために使用されます。
* `app.moderation.output` LLM出力内容の審査拡張点
  * LLMの出力内容を審査するために使用されます。
  * LLMの出力がストリーミング形式の場合、出力内容は100文字ごとに分割され、APIにリクエストされます。これにより、出力内容が長い場合でも審査が遅れないようにします。

### app.moderation.input 拡張点 <a href="#usercontentappmoderationinput-kuo-zhan-dian" id="usercontentappmoderationinput-kuo-zhan-dian"></a>

ChatflowやAgent、チャットアシスタントなどのアプリケーションで**コンテンツ審査>入力内容の審査**を有効にすると、Difyは対応するAPI拡張に以下のHTTP POSTリクエストを送信します：

#### リクエストボディ <a href="#user-content-request-body" id="user-content-request-body"></a>

```
{
    "point": "app.moderation.input", // 拡張点タイプ。ここでは固定で app.moderation.input
    "params": {
        "app_id": string,  // アプリケーションID
        "inputs": {  // 端末ユーザーが送信した変数の値。key は変数名、value は変数の値
            "var_1": "value_1",
            "var_2": "value_2",
            ...
        },
        "query": string | null  // 端末ユーザーの現在の対話入力内容。対話型アプリケーションの固定パラメータ。
    }
}
```

* 例
  * ```
    {
        "point": "app.moderation.input",
        "params": {
            "app_id": "61248ab4-1125-45be-ae32-0ce91334d021",
            "inputs": {
                "var_1": "I will kill you.",
                "var_2": "I will fuck you."
            },
            "query": "Happy everydays."
        }
    }
    ```

#### APIレスポンス規格 <a href="#usercontentapi-fan-hui" id="usercontentapi-fan-hui"></a>

```
{
    "flagged": bool,  // 検証ルールに違反しているかどうか
    "action": string, // アクション。direct_output 予設回答の直接出力; overridden 送信された変数値の上書き
    "preset_response": string,  // 予設回答（actionがdirect_outputの場合のみ返される）
    "inputs": {  // 端末ユーザーが送信した変数の値。key は変数名、value は変数の値（actionがoverriddenの場合のみ返される）
        "var_1": "value_1",
        "var_2": "value_2",
        ...
    },
    "query": string | null  // 上書きされた端末ユーザーの現在の対話入力内容。対話型アプリケーションの固定パラメータ。（actionがoverriddenの場合のみ返される）
}
```

* 例
  * `action=direct_output`
    * ```
      {
          "flagged": true,
          "action": "direct_output",
          "preset_response": "Your content violates our usage policy."
      }
      ```
  * `action=overridden`
    * ```
      {
          "flagged": true,
          "action": "overridden",
          "inputs": {
              "var_1": "I will *** you.",
              "var_2": "I will *** you."
          },
          "query": "Happy everydays."
      }
      ```

### app.moderation.output 拡張点 <a href="#usercontentappmoderationoutput-kuo-zhan-dian" id="usercontentappmoderationoutput-kuo-zhan-dian"></a>

ChatflowやAgent、チャットアシスタントなどのアプリケーションで**コンテンツ審査>出力内容の審査**を有効にすると、Difyは対応するAPI拡張に以下のHTTP POSTリクエストを送信します：

#### リクエストボディ <a href="#user-content-request-body-1" id="user-content-request-body-1"></a>

```
{
    "point": "app.moderation.output", // 拡張点タイプ。ここでは固定で app.moderation.output
    "params": {
        "app_id": string,  // アプリケーションID
        "text": string  // LLMの回答内容。LLMの出力がストリーミング形式の場合、ここには100文字ごとの分割された内容が入ります。
    }
}
```

* 例
  * ```
    {
        "point": "app.moderation.output",
        "params": {
            "app_id": "61248ab4-1125-45be-ae32-0ce91334d021",
            "text": "I will kill you."
        }
    }
    ```

#### APIレスポンス規格 <a href="#usercontentapi-fan-hui-1" id="usercontentapi-fan-hui-1"></a>

```
{
    "flagged": bool,  // 検証ルールに違反しているかどうか
    "action": string, // アクション。direct_output 予設回答の直接出力; overridden 送信された変数値の上書き
    "preset_response": string,  // 予設回答（actionがdirect_outputの場合のみ返される）
    "text": string  // 上書きされたLLMの回答内容。（actionがoverriddenの場合のみ返される）
}
```

* 例
  * `action=direct_output`
    * ```
      {
          "flagged": true,
          "action": "direct_output",
          "preset_response": "Your content violates our usage policy."
      }
      ```
  * `action=overridden`
    * ```
      {
          "flagged": true,
          "action": "overridden",
          "text": "I will *** you."
      }
      ```

## コード例

以下は、Cloudflareにデプロイできる`src/index.ts`コードの例です。（Cloudflareの完全な使用方法については、[このドキュメント](https://docs.dify.ai/ja-jp/guides/extension/api-based-extension/cloudflare-workers)を参照してください）

このコードは、キーワードマッチングを実行し、Input（ユーザーの入力内容）および出力（大規模モデルからの返答内容）をフィルタリングします。ユーザーは必要に応じてマッチングロジックを変更できます。

```
import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { generateSchema } from '@anatine/zod-openapi';

type Bindings = {
  TOKEN: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// API形式の検証 ⬇️
const schema = z.object({
  point: z.union([
    z.literal("ping"),
    z.literal("app.external_data_tool.query"),
    z.literal("app.moderation.input"),
    z.literal("app.moderation.output"),
  ]), // 'point'の値を特定の値に制限
  params: z
    .object({
      app_id: z.string().optional(),
      tool_variable: z.string().optional(),
      inputs: z.record(z.any()).optional(),
      query: z.any(),
      text: z.any()
    })
    .optional(),
});

// OpenAPIスキーマを生成
app.get("/", (c) => {
  return c.json(generateSchema(schema));
});

app.post(
  "/",
  (c, next) => {
    const auth = bearerAuth({ token: c.env.TOKEN });
    return auth(c, next);
  },
  zValidator("json", schema),
  async (c) => {
    const { point, params } = c.req.valid("json");
    if (point === "ping") {
      return c.json({
        result: "pong",
      });
    }
    // ⬇️ ここにロジックを実装 ⬇️
    // point === "app.external_data_tool.query"
    else if (point === "app.moderation.input"){
    // 入力チェック ⬇️
    const inputkeywords = ["入力フィルターテスト1", "入力フィルターテスト2", "入力フィルターテスト3"];

    if (inputkeywords.some(keyword => params.query.includes(keyword))) 
      {
      return c.json({
        "flagged": true,
        "action": "direct_output",
        "preset_response": "入力に不適切なコンテンツが含まれています。別の質問を試してください！"
      });
    } else {
      return c.json({
        "flagged": false,
        "action": "direct_output",
        "preset_response": "入力に問題はありません"
      });
    }
    // 入力チェック完了 
    }
    
    else {
      // 出力チェック ⬇️
      const outputkeywords = ["出力フィルターテスト1", "出力フィルターテスト2", "出力フィルターテスト3"]; 

  if (outputkeywords.some(keyword => params.text.includes(keyword))) 
    {
      return c.json({
        "flagged": true,
        "action": "direct_output",
        "preset_response": "出力に機密情報が含まれており、システムによってフィルタリングされました。別の質問をしてください！"
      });
    }
  
  else {
    return c.json({
      "flagged": false,
      "action": "direct_output",
      "preset_response": "出力に問題はありません"
    });
  };
    }
    // 出力チェック完了 
  }
);

export default app;
```