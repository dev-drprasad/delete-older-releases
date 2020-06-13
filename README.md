# GitHub Action: Delete multiple releases

👉🏼 🚧🚧 **STILL IN PROGRESS** 🚧🚧 👈🏼

This action deletes multiple releases of given repo

Add following step to your workflow:

```yaml
- uses: dev-drprasad/delete-multiple-releases@v0.1.0
  with:
    repo: dev-drprasad/delete-multiple-releases # defaults to current repo
    keep_latest: 3
  env:
    GITHUB_TOKEN: ${{ secrets.REPO_GITHUB_TOKEN }}
```

### Available Options

#### `keep_latest`

| required |
| -------- |
| true     |

If specified, latest specified number of releases (sorted by time) will be kept. Pass `0` if you want to delete all releases

#### `repo`

| required | default               |
| -------- | --------------------- |
| false    | repo executing action |

Repo name in the format of `<owner>/<repoName>`. If passed repo, make sure to pass `GITHUB_TOKEN` with permissions to delete releases as env variable

#### `keep_tags`

| required | default |
| -------- | ------- |
| false    | false   |

If passed `true`, tags won't be deleted
