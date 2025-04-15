# SearXNG

> ツール作者 @Junytang。

{% hint style="warning" %}
「ツール」は「プラグイン」エコシステムに完全アップグレードされました。詳しい使用方法については[プラグイン開発](https://docs.dify.ai/ja-jp/plugins/quick-start/install-plugins)をご参照ください。以下の内容はアーカイブされています。
{% endhint %}

SearXNGは、様々な検索サービスの結果を統合する無料のインターネットメタサーチエンジンです。ユーザーは追跡されず、検索行動も分析されません。Difyから直接このツールを利用することができます。

以下では、[コミュニティ版](https://docs.dify.ai/ja-jp/getting-started/install-self-hosted/docker-compose)でDockerを使用してSearXNGをDifyに統合する方法を説明します。

> Difyクラウドサービス内でSearXNGを使用したい場合は、[SearXNGインストールドキュメント](https://docs.searxng.org/admin/installation.html)を参照して自分のサービスを構築し、Difyに戻って「ツール > SearXNG > 認証へ行く」ページでサービスのBase URLを入力してください。

## 1. Dify設定ファイルの変更

SearXNGの設定ファイルは `dify/api/core/tools/provider/builtin/searxng/docker/settings.yml` にあります。設定ドキュメントは[こちら](https://docs.searxng.org/admin/settings/index.html)を参照してください。

必要に応じて設定を変更するか、デフォルト設定をそのまま使用することもできます。

## 2. サービスの起動

Difyのルートディレクトリで以下のコマンドを実行し、Dockerコンテナを起動します。

```bash
cd dify
docker run --rm -d -p 8081:8080 -v "${PWD}/api/core/tools/provider/builtin/searxng/docker:/etc/searxng" searxng/searxng
```

## 3. SearXNGの使用

`ツール > SearXNG > 認証へ行く` でアクセスアドレスを入力し、DifyサービスとSearXNGサービスの接続を確立します。SearXNGのDocker内部アドレスは通常 `http://host.docker.internal:8081` です。

---

## Linux VMでプライベートインスタンスとしてSearXNGをホスティングする

このセクションでは、**Linux VM**でSearXNGをホスティングし、Difyと統合する方法について説明します。

### 1. Linux VM環境の準備

Linux VM環境が以下の条件を満たしていることを確認してください：

- **DockerとDocker Composeがインストールされている**。
- サポートされているLinuxディストリビューション（Ubuntu 24.04や他のDebianベースのシステムなど）を使用できます。

#### 1.1 Dockerのインストール

以下のコマンドを実行してDockerをインストールします：

```bash
# パッケージリストの更新
sudo apt update

# 必要なパッケージのインストール
sudo apt install apt-transport-https ca-certificates curl software-properties-common

# Docker GPGキーの追加
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Docker公式リポジトリの追加
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Dockerのインストール
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io
```

Dockerが正常にインストールされたか確認します：

```bash
docker --version
```

#### 1.2 Docker Composeのインストール

以下のコマンドを実行してDocker Composeをインストールします：

```bash
sudo curl -L "https://github.com/docker/compose/releases/download/2.32.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

Docker Composeが正常にインストールされたか確認します：

```bash
docker-compose --version
```

### 2. SearXNG Dockerコンテナの設定

#### 2.1 SearXNG Dockerリポジトリのクローン

まず、SearXNG DockerリポジトリをLinux VMにクローンします：

```bash
git clone https://github.com/searxng/searxng-docker.git
cd searxng-docker
```

#### 2.2 Docker設定ファイルの変更

1. **`docker-compose.yaml`ファイルを変更**して、SearXNGサービスがポート`8081`にバインドされ、Redisサービスが設定されていることを確認します。変更後の`docker-compose.yaml`ファイルは以下のようになります：

```yaml
version: '3'

services:
  searxng:
    image: searxng/searxng:latest
    ports:
      - "8081:8080"  # コンテナの8080ポートをホストマシンの8081ポートにマッピング
    volumes:
      - ./searxng:/etc/searxng  # SearXNG設定ファイルのマウント設定
    networks:
      - searxng_network

  redis:
    image: valkey/valkey:8-alpine
    ports:
      - "6379:6379"  # Redisサービスのマッピングポート
    networks:
      - searxng_network

  caddy:
    image: caddy:2-alpine
    ports:
      - "80:80"
      - "443:443"
    networks:
      - searxng_network

networks:
  searxng_network:
    driver: bridge
```

2. **`settings.yml`設定ファイルを変更**して、SearXNGがすべてのIPアドレスをリッスンし、JSON形式の出力を有効にします：

```yaml
server:
  bind_address: "0.0.0.0"  # 外部アクセスを許可
  port: 8080

search:
  formats:
    - html
    - json
    - csv
    - rss
```

#### 2.3 Dockerコンテナの起動

設定ファイルを変更した後、以下のコマンドでDockerコンテナを起動します：

```bash
docker-compose up -d
```

### 3. SearXNGサービスをアクセス可能にする

デフォルトでは、DockerコンテナはlocalホストまたはIP 127.0.0.1にバインドされます。外部デバイス（Difyなど）からSearXNGにアクセスできるようにするには、Linux VMが公開IPアドレスを通じてポート`8081`にアクセスできることを確認する必要があります。

VMの公開IPアドレスを確認するには：

```bash
ip addr show
```

ファイアウォールでポート`8081`が開放されていることを確認してください。

---

## 4. SearXNGとDifyの統合

Linux VM上でSearXNGインスタンスが実行されたら、Difyと接続できます。

### 4.1 Difyの設定

1. Difyプラットフォームの**ツール > SearXNG > 認証へ行く**ページで、自分でホストしているSearXNGサービスの**Base URL**を入力します。フォーマットは以下の通りです：

```text
http://<your-linux-vm-ip>:8081
```

2. 設定を保存すると、DifyはSearXNGインスタンスに接続できるようになります。

---

### 5. SearXNG統合のテスト

`curl`コマンドを使用してSearXNGサービスが正常に動作しているかテストできます：

```bash
curl "http://<your-linux-vm-ip>:8081/search?q=apple&format=json&categories=general"
```

すべてが正常に動作していれば、「apple」の検索結果を含むJSON応答が返されるはずです。
