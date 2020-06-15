# GitHub Action: Delete older releases

This action deletes older releases of given repo

Add following step to your workflow:

```yaml
- uses: dev-drprasad/delete-older-releases@v0.1.0
  with:
    repo: dev-drprasad/delete-older-releases # defaults to current repo
    keep_latest: 3
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Available Options

#### `keep_latest`

| required |
| -------- |
| true     |

Represents number of latest releases (sorted by `created_at`) to keep. Pass `0` if you want to delete all releases

#### `repo`

| required | default               |
| -------- | --------------------- |
| false    | repo executing action |

Repo name in the format of `<owner>/<repoName>`. Defaults to the repo that executing this action
