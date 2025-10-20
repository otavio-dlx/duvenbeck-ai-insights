### Run Qdrant with Custom Configuration

Source: https://github.com/qdrant/qdrant/blob/master/docs/QUICK_START.md

This command runs Qdrant using Docker, mounting custom volumes for storage, snapshots, and configuration, and exposing port 6333. It allows for fine-grained setup and persistence.

```bash
docker run -p 6333:6333 \
    -v $(pwd)/path/to/data:/qdrant/storage \
    -v $(pwd)/path/to/snapshots:/qdrant/snapshots \
    -v $(pwd)/path/to/custom_config.yaml:/qdrant/config/production.yaml \
    qdrant/qdrant
```

--------------------------------

### Get Qdrant Collection Information

Source: https://github.com/qdrant/qdrant/blob/master/docs/QUICK_START.md

This `curl` command retrieves information about the 'test_collection' from the Qdrant instance running on localhost:6333. It sends a GET request.

```bash
curl 'http://localhost:6333/collections/test_collection'
```

--------------------------------

### Build Qdrant from Source

Source: https://github.com/qdrant/qdrant/blob/master/docs/QUICK_START.md

This command builds a custom Qdrant Docker image from the current directory's source code, tagging it as 'qdrant/qdrant'.

```bash
docker build . --tag=qdrant/qdrant
```

--------------------------------

### Install Protobuf Compiler

Source: https://github.com/qdrant/qdrant/blob/master/docs/DEVELOPMENT.md

Download, extract, and install the Protocol Buffers compiler (protoc) from source. This is required for generating code from .proto files used in Qdrant's communication protocols.

```shell
PROTOC_VERSION=22.2
PKG_NAME=$(uname -s | awk '{print ($1 == "Darwin") ? "osx-universal_binary" : (($1 == "Linux") ? "linux-x86_64" : "")}')

# curl `proto` source file
curl -LO https://github.com/protocolbuffers/protobuf/releases//download/v$PROTOC_VERSION/protoc-$PROTOC_VERSION-$PKG_NAME.zip

unzip protoc-$PROTOC_VERSION-$PKG_NAME.zip -d $HOME/.local

export PATH="$PATH:$HOME/.local/bin"

# remove source file if not needed
rm protoc-$PROTOC_VERSION-$PKG_NAME.zip

# check installed `protoc` version
protoc --version
```

--------------------------------

### Install Rustfmt

Source: https://github.com/qdrant/qdrant/blob/master/docs/DEVELOPMENT.md

Install the 'rustfmt' toolchain for Rust. Rustfmt is used for formatting Rust code according to style guidelines.

```shell
rustup component add rustfmt
```

--------------------------------

### Run Qdrant with Docker

Source: https://github.com/qdrant/qdrant/blob/master/docs/QUICK_START.md

This snippet shows how to pull the latest Qdrant Docker image and run it with default configurations, exposing the default port 6333.

```bash
docker pull qdrant/qdrant
docker run -p 6333:6333 qdrant/qdrant
```

--------------------------------

### Serve HTTP Documentation with Python

Source: https://github.com/qdrant/qdrant/blob/master/docs/DEVELOPMENT.md

A command to start a simple HTTP server using Python's built-in module. This is used to expose generated documentation files for browsing and validation.

```python
python -m http.server
```

--------------------------------

### Basic Search in Qdrant

Source: https://github.com/qdrant/qdrant/blob/master/docs/QUICK_START.md

Performs a basic vector search on a Qdrant collection without any filters. It sends a vector and requests the top 'k' results.

```bash
curl -L -X POST 'http://localhost:6333/collections/test_collection/points/search' \
    -H 'Content-Type: application/json' \
    --data-raw 
{
        "vector": [0.2,0.1,0.9,0.7],
        "top": 3
    }
```

--------------------------------

### Run Qdrant Docker Container

Source: https://github.com/qdrant/qdrant/blob/master/docs/DEVELOPMENT.md

Run a Qdrant Docker container, exposing the default port 6333. This is the basic command to get Qdrant up and running.

```bash
docker run -p 6333:6333 qdrant/qdrant
```

--------------------------------

### Install Python Test Dependencies

Source: https://github.com/qdrant/qdrant/blob/master/docs/DEVELOPMENT.md

Install Python dependencies required for running Qdrant's tests using Poetry. This command ensures all necessary libraries are available for testing the API and consensus mechanisms.

```shell
poetry -C tests install --sync
```
