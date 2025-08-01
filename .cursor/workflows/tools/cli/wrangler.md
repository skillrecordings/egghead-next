# Cloudflare Wrangler CLI Reference Guide

**Your Task: When interacting with Cloudflare Workers, Pages, or other Cloudflare developer platform resources via the command line, consult this reference guide for the `wrangler` CLI. Use this information to construct appropriate `wrangler` commands based on the user's objectives.**

_This document is based on `wrangler` CLI help output and provides a comprehensive overview of its commands and structure. For the most specific details on any subcommand or its options, you can also execute `wrangler <command> [subcommand] --help` in a terminal environment if available._

## I. Top-Level Commands

- `wrangler docs [search...]` — Open Wrangler's command documentation in your browser.
- `wrangler init [name]` — Initialize a basic Worker project.
- `wrangler dev [script]` — Start a local development server for your Worker.
- `wrangler deploy [script]` — Deploy your Worker to Cloudflare.
- `wrangler deployments` — List and view current and past deployments.
- `wrangler rollback [version-id]` — Rollback a Worker to a previous deployment version.
- `wrangler versions` — List, view, upload, and deploy specific Worker versions.
- `wrangler triggers` — Update deployment triggers [experimental].
- `wrangler delete [script]` — Delete a Worker from Cloudflare.
- `wrangler tail [worker]` — Start a real-time log tailing session for a Worker.
- `wrangler secret` — Manage secrets for a Worker (deprecated for new projects, prefer `.dev.vars` or Secrets Store).
- `wrangler types [path]` — Generate TypeScript type definitions from your Worker's configuration (`wrangler.toml`).

## II. Resource Management Commands

- `wrangler kv` — Manage Workers KV Namespaces (key-value store).
- `wrangler queues` — Manage Workers Queues (message queues).
- `wrangler r2` — Manage R2 buckets and objects (object storage).
- `wrangler d1` — Manage Workers D1 databases (serverless SQL).
- `wrangler vectorize` — Manage Vectorize indexes (vector embeddings database).
- `wrangler hyperdrive` — Manage Hyperdrive database accelerators.
- `wrangler cert` — Manage client mTLS certificates and CA certificate chains [open-beta].
- `wrangler pages` — Configure and manage Cloudflare Pages projects.
- `wrangler mtls-certificate` — Manage certificates for mTLS connections between services.
- `wrangler pubsub` — Manage Pub/Sub brokers for real-time messaging [private beta].
- `wrangler dispatch-namespace` — Manage dispatch namespaces for Worker-to-Worker communication.
- `wrangler ai` — Manage AI models and deployments on Workers AI.
- `wrangler workflows` — Manage Cloudflare Workflows [generally available].
- `wrangler pipelines` — Manage Cloudflare Pipelines [open-beta].
- `wrangler login` — Authenticate `wrangler` with your Cloudflare account.
- `wrangler logout` — Log out from Cloudflare.
- `wrangler whoami` — Retrieve information about the currently authenticated Cloudflare user.
- `wrangler secrets-store` — Manage secrets using the centralized Secrets Store [alpha].

---

## III. Global Flags (Applicable to most commands)

- `-c, --config <file>` — Path to a custom `wrangler.toml` configuration file.
- `--cwd <dir>` — Run `wrangler` as if it were started in the specified directory.
- `-e, --env <env>` — Specify an environment to use (defined in `wrangler.toml`). Affects operations and selection of `.env`/`.dev.vars` files.
- `-h, --help` — Show help information for the command or subcommand.
- `-v, --version` — Show `wrangler` CLI version number.

---

## IV. Example Subcommand Structures (Illustrative)

This section shows the hierarchical structure of some common resource management commands. Use `wrangler <command> <subcommand> --help` for full options at each level.

### `wrangler kv` (Workers KV)

- `wrangler kv:namespace create <NAMESPACE_NAME>`
- `wrangler kv:namespace list`
- `wrangler kv:namespace delete --namespace-id <ID>`
- `wrangler kv:key put <KEY> [VALUE] --namespace-id <ID> [--path --preview]`
- `wrangler kv:key list --namespace-id <ID>`
- `wrangler kv:key get <KEY> --namespace-id <ID>`
- `wrangler kv:key delete <KEY> --namespace-id <ID>`
- `wrangler kv:bulk put <FILENAME.JSON> --namespace-id <ID>` (File format: `[{"key":"foo", "value":"bar"},...]`)
- `wrangler kv:bulk delete <FILENAME.JSON> --namespace-id <ID>` (File format: `["foo", "bar", ...]`)

### `wrangler queues` (Workers Queues)

- `wrangler queues list`
- `wrangler queues create <QUEUE_NAME>`
- `wrangler queues update <QUEUE_NAME> [--consumer <WORKER_NAME> --consumer-batch-size <SIZE> ...]`
- `wrangler queues delete <QUEUE_NAME>`
- `wrangler queues info <QUEUE_NAME>`
- `wrangler queues consumer add <QUEUE_NAME> <WORKER_NAME> [--batch-size <SIZE> ...]`
- `wrangler queues consumer remove <QUEUE_NAME> <WORKER_NAME>`
- `wrangler queues purge <QUEUE_NAME>`

### `wrangler r2` (R2 Object Storage)

- `wrangler r2 object get <BUCKET_NAME>/<OBJECT_KEY> [--file <OUTPUT_FILE>]`
- `wrangler r2 object put <BUCKET_NAME>/<OBJECT_KEY> --file <SOURCE_FILE> [--content-type <MIME>]`
- `wrangler r2 object delete <BUCKET_NAME>/<OBJECT_KEY>`
- `wrangler r2 bucket create <BUCKET_NAME>`
- `wrangler r2 bucket list`
- `wrangler r2 bucket info <BUCKET_NAME>`
- `wrangler r2 bucket delete <BUCKET_NAME>`

### `wrangler d1` (D1 Serverless SQL)

- `wrangler d1 list`
- `wr wrangler d1 info <DATABASE_NAME>`
- `wrangler d1 create <DATABASE_NAME>`
- `wrangler d1 delete <DATABASE_NAME>`
- `wrangler d1 execute <DATABASE_NAME> --command "SELECT * FROM users;"`
- `wrangler d1 execute <DATABASE_NAME> --file ./migrations/0001_init.sql`
- `wrangler d1 backup list <DATABASE_NAME>`
- `wrangler d1 backup create <DATABASE_NAME>`
- `wrangler d1 backup restore <DATABASE_NAME> <BACKUP_ID>`
- `wrangler d1 migrations list <DATABASE_NAME>`
- `wrangler d1 migrations apply <DATABASE_NAME>`

### `wrangler vectorize` (Vectorize Database)

- `wrangler vectorize create <INDEX_NAME> --dimensions <NUMBER> --metric <METRIC_TYPE>`
- `wrangler vectorize delete <INDEX_NAME>`
- `wrangler vectorize get <INDEX_NAME>`
- `wrangler vectorize list`
- `wrangler vectorize query <INDEX_NAME> --vector "[0.1, 0.2, ...]" [--top-k <NUMBER>]`
- `wrangler vectorize insert <INDEX_NAME> --file <VECTORS_FILE.JSON>` (File: `[{"id":"vec1", "values":[...], "metadata":{...}}, ...]`)

_(Other subcommand trees like `hyperdrive`, `pages`, `ai`, etc., follow similar patterns. Consult `wrangler <command> --help` for specifics.)_

---

**REMEMBER: This guide is your primary reference for `wrangler` CLI commands, their structure, and common resource management tasks. Use it to accurately construct commands to interact with the Cloudflare developer platform. For detailed options on any specific command, the `--help` flag is your best friend (e.g., `wrangler r2 bucket create --help`).**
