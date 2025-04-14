# Dify MCP プラグインガイド：ワンクリックで Zapier に接続してメールを自動送信

**このガイドの目的：**

Dify ワークスペースに MCP SSE プラグインをインストールし、Zapier MCP サービスをリモート呼び出しして自動メール送信を実現する方法を解説します。

## プロジェクト背景

Anthropic は2024年末にモデルコンテキストプロトコル（MCP）をリリースしました。新興のオープンプロトコルとして、MCPはLLMと外部アプリケーション間に双方向通信チャネルを構築し、AIの「USB-C」インターフェースのような役割を果たします。これにより、モデルは様々な外部ツールやAPIを発見、理解し、安全に呼び出すことができます。

これは以下を意味します：開発者はもはや各外部サービスに接続するための複雑なカスタムインターフェースを作成する必要がなくなりました。ユーザーは、日常のオフィス業務の処理、データ分析、またはマーケティング自動化の実行など、AIが膨大な数のサードパーティアプリケーションを簡単に呼び出す能力を体験できます。AIは「インテリジェントな対話」から「効率的なアクション」へと進化しています。

Dify コミュニティでも、MCPは同様に大きな注目を集めています。コミュニティ開発者はプラグインマーケットプレイスに複数のMCPプラグインを提供しており、プラグインを通じて外部MCPサービスをDify Agentアプリケーションやワークフローに簡単に接続できます。

このガイドでは、MCP SSEプラグインを例に、Dify内でMCPプラグインを使用してZapierに接続し、自動メール送信プロセスを完了する方法を詳しく説明します。

## 前提条件

- Dify クラウド版 / Dify コミュニティ版 ≥ v1.0.0
- Zapier アカウント

## Dify で Zapier MCP サービスを初期化する

Zapier の MCP Server は、既存の7000以上のアプリケーションと30,000以上のアクション（Action）を単一の MCP Server URL にまとめています。Zapier 管理画面で、メール送信、CRMへのレコード作成、Slackへの通知送信など、必要なツールとアクションを選択して設定できます。MCP Server URL を Dify MCP プラグインの設定に入力するだけで、LLMが会話やプロセスの中で自動的にこれらのツールを呼び出し、様々なタスクを完了できるようになります。

### ステップ1：Zapier MCP Server URL を取得する

1. [Zapier MCP 設定ページ](https://actions.zapier.com/settings/mcp/)にアクセスします。
2. MCP Server URL を取得し、後ほど Dify のプラグイン設定に入力します。

![](https://assets-docs.dify.ai/2025/04/15bba178b0adddcd3e1961807dfe14f0.png)

3. URL の下にある "Edit MCP Actions" をクリックして、ツールとアクションの追加ページに進みます。

4. "Add a new action" をクリックし、`Gmail: Send Email` を検索します。実際のニーズに応じて異なるメールアクションを選択することもできます。

![](https://assets-docs.dify.ai/2025/04/718e214166ca6eed6771d44f3b6ab718.png)

5. 「メール送信」を例に説明します：

Gmail アカウントの下にある "Connect" をクリックし、Gmail アカウントにログインして認証します。

メールの宛先（To）、件名（Subject）、本文（Body）などのフィールドについては、"Have AI guess a value for this field" を選択できます。具体的な内容は、Agent が実際の会話やシナリオに基づいて動的に決定します。

![](https://assets-docs.dify.ai/2025/04/637ce6b46ab706f4512a2dceb25a8162.png)

6. 設定完了後、さらに異なるアクションを追加して、Agent が使用できるツールセットを充実させることができます。

### ステップ2：MCP SSE プラグインをインストールする

1. Dify プラグインマーケットプレイスに移動し、MCP SSE プラグインを検索してインストールをクリックします。

![](https://assets-docs.dify.ai/2025/04/20174032b8feb624a52ac36d65e7c0fa.png)

> サービスの安定性を確保するため、プラグインバージョン v0.0.4 の使用をお勧めします。ワークスペース内のプラグイン詳細ページでバージョンを調整できます。
> ![](https://assets-docs.dify.ai/2025/04/b076d40ea120dea544df49bc52199ad6.png)


2. プラグインページの「認証する」ボタンをクリックし、上記で取得した Zapier MCP Server URL をプラグインに貼り付けます。アドレス形式の参考：

```json
{
  "server_name": {
    "url": "https://actions.zapier.com/mcp/*******/sse",
    "headers": {},
    "timeout": 5,
    "sse_read_timeout": 300
  }
}
```

![](https://assets-docs.dify.ai/2025/04/5ba078e8804c1bee5bcec167d260a92a.png)

### ステップ3：Dify Agent アプリケーションを作成し、MCP SSE サービスを有効にする

1. Agent タイプのアプリケーションを作成する

ナビゲーションから「ワークスタジオ」を選択し、アプリケーションリストで「空白から作成」を選択して Agent アプリケーションタイプを選びます。アプリケーション名を入力して作成を完了します。

![](https://assets-docs.dify.ai/2025/04/aaef5e115211c2b04382552e537877fa.png)

2. MCP ツールを追加する

アプリケーションツールバーで `Fetch MCP Tools` と `Call MCP Tool` をそれぞれ追加します。

![](https://assets-docs.dify.ai/2025/04/4e570e4e42720b3e202d409fa93f983a.png)

3. LLM を設定する

MCP の使用時には多くのトークンが消費される可能性があるため、よりコストパフォーマンスの高い LLM を使用することをお勧めします。このガイドでは、`deepseek-chat` モデルを例として使用します。[DeepSeek Platform](https://platform.deepseek.com/usage) で API キーを申請し、「設定」→「モデルプロバイダー」→「DeepSeek」に入力してください。

> モデルプロバイダーで DeepSeek モデルが見つからない場合は、Dify プラグインマーケットプレイスで DeepSeek プラグインをインストールしてください。

## 使用シナリオ1：MCP サービスを使用して単一のメールを自動送信する

設定が完了したら、Agent との会話を通じて、メールドラフトを自動生成し、指定した受信者に送信できます。

![](https://assets-docs.dify.ai/2025/04/fc76cc8e7dd7476199e9810fa5403f3b.png)

会話ボックスで LLM にメール送信タスクを完了するよう指示します。MCP の実行が完了すると、メールは自動的に受信者に送信されます。

![](https://assets-docs.dify.ai/2025/04/dc80a8fb00800e8938f3918fc908bc1b.png)

## 使用シナリオ2：ワークフローで MCP Agent Strategy を設定する

MCP SSE プラグインをツールとして Agent に追加するだけでなく、ワークフローでも MCP Agent Strategy プラグインを使用できます。インストール完了後、対応する Agent ノード内で設定します。具体的な手順は以下の通りです：

![](https://assets-docs.dify.ai/2025/04/0a340d4cc4a549e6b7420b39cfd805d6.png)

以下の JSON 構造をテンプレートとして使用し、`url` の値を MCP Server アドレスに置き換えます。修正後の完全な JSON を `MCP SERVER URL` 設定ボックスにコピー＆ペーストします：

```json
{
  "server_name": {
    "url": "https://actions.zapier.com/mcp/*******/sse",
    "headers": {},
    "timeout": 5,
    "sse_read_timeout": 300
  }
}
```

![](https://assets-docs.dify.ai/2025/04/883c70b8a714c0c7e7a25f5f712c59e0.png)

設定完了後、ワークフローがこの Agent ノードに到達すると、プロンプト指示に従って、設定された Zapier MCP Server を利用してタスクを実行できます。下図のように、Gmail を呼び出してメールを送信します：

![](https://assets-docs.dify.ai/2025/04/a201fb50200737881e4ddc0b31518336.png)
