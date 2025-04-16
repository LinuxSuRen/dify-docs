# W&B Weaveの統合

### W&B Weaveとは

Weights & Biases (W&B) Weaveは、LLMベースのアプリケーションの追跡、実験、評価、デプロイ、改善のためのフレームワークです。柔軟性とスケーラビリティを考慮して設計されたWeaveは、LLMアプリケーション開発ワークフローのあらゆる段階をサポートします：

{% hint style="info" %}
詳細については、[Weave](https://weave-docs.wandb.ai/)を参照してください。
{% endhint %}

***

### Weaveの設定方法

#### 1. [W&B Weave](https://wandb.ai/signup)に登録/ログイン
APIキーを取得する

次に、https://wandb.ai でWeights & Biases (W&B)アカウントを作成し、https://wandb.ai/authorize からAPIキーをコピーします

#### 2. W&B WeaveをDifyと統合する

DifyアプリケーションでWeaveを設定します。監視が必要なアプリケーションを開き、サイドメニューの**モニタリング**を開き、ページ上の**アプリケーションパフォーマンスの追跡**を選択します。

![](https://assets-docs.dify.ai/2025/04/c33e8fda75ee9052ed23c8690e314862.png)

設定をクリックした後、**APIキー**と**プロジェクト名**を貼り付け、**W&Bエンティティ**（オプション、デフォルトはユーザー名）も指定して設定を保存します。

![](https://assets-docs.dify.ai/2025/04/60bce1ae7b883825b13526d172ae0073.png)

正常に保存されると、現在のページで監視状態を確認できます。

![](https://assets-docs.dify.ai/2025/04/9486cee7bbb61f069842c9ea860e679c.png)

### Weaveでモニタリングデータを表示する

設定が完了すると、Dify内のアプリケーションからのデバッグまたは本番データをWeaveで監視できます。

![](https://assets-docs.dify.ai/2025/04/a1c5aa80325e6d0223d48a178393baec.png)

Weaveに切り替えると、ダッシュボードでDifyアプリケーションの詳細な操作ログを確認できます。

![](https://assets-docs.dify.ai/2025/04/2cb04027c00b606029fcc26af2801bfe.png)

Weaveを通じた詳細なLLM操作ログは、Difyアプリケーションのパフォーマンスを最適化するのに役立ちます。

### モニタリングデータリスト

#### **ワークフロー/チャットフロートレース情報**

**ワークフローとチャットフローを追跡するために使用**

| ワークフロー                           | Weaveトレース                |
| ------------------------------------ | ---------------------------- |
| workflow\_app\_log\_id/workflow\_run\_id | id                         |
| user\_session\_id                    | メタデータに配置              |
| workflow\_{id}                       | name                         |
| start\_time                          | start\_time                  |
| end\_time                            | end\_time                    |
| inputs                               | inputs                       |
| outputs                              | outputs                      |
| モデルトークン消費量                   | usage\_metadata              |
| metadata                             | extra                        |
| error                                | error                        |
| \[workflow]                          | tags                         |
| "conversation\_id/none for workflow" | メタデータ内のconversation\_id |
| conversion\_id                       | parent\_run\_id              |

**ワークフロートレース情報**

* workflow\_id - ワークフローの一意の識別子
* conversation\_id - 会話ID
* workflow\_run\_id - 現在の実行のID
* tenant\_id - テナントID
* elapsed\_time - 現在の実行にかかった時間
* status - 実行ステータス
* version - ワークフローバージョン
* total\_tokens - 現在の実行で使用されたトークンの総数
* file\_list - 処理されたファイルのリスト
* triggered\_from - 現在の実行をトリガーしたソース
* workflow\_run\_inputs - 現在の実行の入力データ
* workflow\_run\_outputs - 現在の実行の出力データ
* error - 現在の実行中に発生したエラー
* query - 実行中に使用されたクエリ
* workflow\_app\_log\_id - ワークフローアプリケーションログID
* message\_id - 関連するメッセージID
* start\_time - 実行の開始時間
* end\_time - 実行の終了時間
* workflow node executions - ワークフローノード実行に関する情報
* メタデータ
  * workflow\_id - ワークフローの一意の識別子
  * conversation\_id - 会話ID
  * workflow\_run\_id - 現在の実行のID
  * tenant\_id - テナントID
  * elapsed\_time - 現在の実行にかかった時間
  * status - 実行ステータス
  * version - ワークフローバージョン
  * total\_tokens - 現在の実行で使用されたトークンの総数
  * file\_list - 処理されたファイルのリスト
  * triggered\_from - 現在の実行をトリガーしたソース

#### **メッセージトレース情報**

**LLM関連の会話を追跡するために使用**

| チャット                             | Weaveトレース                |
| ---------------------------------- | ----------------------------- |
| message\_id                        | id                           |
| user\_session\_id                  | メタデータに配置               |
| "message\_{id}"                    | name                         |
| start\_time                        | start\_time                  |
| end\_time                          | end\_time                    |
| inputs                             | inputs                       |
| outputs                            | outputs                      |
| モデルトークン消費量                 | usage\_metadata              |
| metadata                           | extra                        |
| error                              | error                        |
| \["message", conversation\_mode]   | tags                         |
| conversation\_id                   | メタデータ内のconversation\_id |
| conversion\_id                     | parent\_run\_id              |

**メッセージトレース情報**

* message\_id - メッセージID
* message\_data - メッセージデータ
* user\_session\_id - ユーザーセッションID
* conversation\_model - 会話モード
* message\_tokens - メッセージ内のトークン数
* answer\_tokens - 回答内のトークン数
* total\_tokens - メッセージと回答内のトークンの総数
* error - エラー情報
* inputs - 入力データ
* outputs - 出力データ
* file\_list - 処理されたファイルのリスト
* start\_time - 開始時間
* end\_time - 終了時間
* message\_file\_data - メッセージに関連するファイルデータ
* conversation\_mode - 会話モード
* メタデータ
  * conversation\_id - 会話ID
  * ls\_provider - モデルプロバイダー
  * ls\_model\_name - モデルID
  * status - メッセージステータス
  * from\_end\_user\_id - 送信ユーザーのID
  * from\_account\_id - 送信アカウントのID
  * agent\_based - メッセージがエージェントベースかどうか
  * workflow\_run\_id - ワークフロー実行ID
  * from\_source - メッセージソース

#### **モデレーショントレース情報**

**会話モデレーションを追跡するために使用**

| モデレーション   | Weaveトレース           |
| ------------- | ----------------------- |
| user\_id      | メタデータに配置           |
| "moderation"  | name                    |
| start\_time   | start\_time             |
| end\_time     | end\_time               |
| inputs        | inputs                  |
| outputs       | outputs                 |
| metadata      | extra                   |
| \[moderation] | tags                    |
| message\_id   | parent\_run\_id         |

**モデレーショントレース情報**

* message\_id - メッセージID
* user\_id: ユーザーID
* workflow\_app\_log\_id - ワークフローアプリケーションログID
* inputs - モデレーション入力データ
* message\_data - メッセージデータ
* flagged - コンテンツが注意対象としてフラグ付けされているかどうか
* action - 取られた特定のアクション
* preset\_response - プリセット応答
* start\_time - モデレーション開始時間
* end\_time - モデレーション終了時間
* メタデータ
  * message\_id - メッセージID
  * action - 取られた特定のアクション
  * preset\_response - プリセット応答

#### **提案質問トレース情報**

**提案された質問を追跡するために使用**

| 提案質問               | Weaveトレース            |
| ---------------------- | ----------------------- |
| user\_id               | メタデータに配置          |
| suggested\_question    | name                    |
| start\_time            | start\_time             |
| end\_time              | end\_time               |
| inputs                 | inputs                  |
| outputs                | outputs                 |
| metadata               | extra                   |
| \[suggested\_question] | tags                    |
| message\_id            | parent\_run\_id         |

**メッセージトレース情報**

* message\_id - メッセージID
* message\_data - メッセージデータ
* inputs - 入力内容
* outputs - 出力内容
* start\_time - 開始時間
* end\_time - 終了時間
* total\_tokens - トークン数
* status - メッセージステータス
* error - エラー情報
* from\_account\_id - 送信アカウントのID
* agent\_based - メッセージがエージェントベースかどうか
* from\_source - メッセージソース
* model\_provider - モデルプロバイダー
* model\_id - モデルID
* suggested\_question - 提案された質問
* level - ステータスレベル
* status\_message - ステータスメッセージ
* メタデータ
  * message\_id - メッセージID
  * ls\_provider - モデルプロバイダー
  * ls\_model\_name - モデルID
  * status - メッセージステータス
  * from\_end\_user\_id - 送信ユーザーのID
  * from\_account\_id - 送信アカウントのID
  * workflow\_run\_id - ワークフロー実行ID
  * from\_source - メッセージソース

#### **データセット検索トレース情報**

**ナレッジベース検索を追跡するために使用**

| データセット検索        | Weaveトレース            |
| --------------------- | ----------------------- |
| user\_id              | メタデータに配置          |
| dataset\_retrieval    | name                    |
| start\_time           | start\_time             |
| end\_time             | end\_time               |
| inputs                | inputs                  |
| outputs               | outputs                 |
| metadata              | extra                   |
| \[dataset\_retrieval] | tags                    |
| message\_id           | parent\_run\_id         |

**データセット検索トレース情報**

* message\_id - メッセージID
* inputs - 入力内容
* documents - ドキュメントデータ
* start\_time - 開始時間
* end\_time - 終了時間
* message\_data - メッセージデータ
* メタデータ
  * message\_id - メッセージID
  * ls\_provider - モデルプロバイダー
  * ls\_model\_name - モデルID
  * status - メッセージステータス
  * from\_end\_user\_id - 送信ユーザーのID
  * from\_account\_id - 送信アカウントのID
  * agent\_based - メッセージがエージェントベースかどうか
  * workflow\_run\_id - ワークフロー実行ID
  * from\_source - メッセージソース

#### **ツールトレース情報**

**ツール呼び出しを追跡するために使用**

| ツール                  | Weaveトレース            |
| --------------------- | ----------------------- |
| user\_id              | メタデータに配置           |
| tool\_name            | name                    |
| start\_time           | start\_time             |
| end\_time             | end\_time               |
| inputs                | inputs                  |
| outputs               | outputs                 |
| metadata              | extra                   |
| \["tool", tool\_name] | tags                    |
| message\_id           | parent\_run\_id         |

#### **ツールトレース情報**

* message\_id - メッセージID
* tool\_name - ツール名
* start\_time - 開始時間
* end\_time - 終了時間
* tool\_inputs - ツール入力
* tool\_outputs - ツール出力
* message\_data - メッセージデータ
* error - エラー情報（もしあれば）
* inputs - メッセージの入力
* outputs - メッセージの出力
* tool\_config - ツール設定
* time\_cost - 時間コスト
* tool\_parameters - ツールパラメータ
* file\_url - 関連ファイルのURL
* メタデータ
  * message\_id - メッセージID
  * tool\_name - ツール名
  * tool\_inputs - ツール入力
  * tool\_outputs - ツール出力
  * tool\_config - ツール設定
  * time\_cost - 時間コスト
  * error - エラー情報（もしあれば）
  * tool\_parameters - ツールパラメータ
  * message\_file\_id - メッセージファイルID
  * created\_by\_role - 作成者のロール
  * created\_user\_id - 作成者のユーザーID

**名前生成トレース情報**

**会話タイトル生成を追跡するために使用**

| 名前生成           | Weaveトレース            |
| ----------------- | ----------------------- |
| user\_id          | メタデータに配置          |
| generate\_name    | name                    |
| start\_time       | start\_time             |
| end\_time         | end\_time               |
| inputs            | inputs                  |
| outputs           | outputs                 |
| metadata          | extra                   |
| \[generate\_name] | tags                    |

**名前生成トレース情報**

* conversation\_id - 会話ID
* inputs - 入力データ
* outputs - 生成された会話名
* start\_time - 開始時間
* end\_time - 終了時間
* tenant\_id - テナントID
* メタデータ
  * conversation\_id - 会話ID
  * tenant\_id - テナントID