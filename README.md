# GitHub Action: Delete older releases

This action deletes older releases of given repo

Add following step to your workflow:

```yaml
- uses: dev-drprasad/delete-older-releases@v0.1.0
  with:
    repo: <owner>/<repoName> # defaults to current repo
    keep_latest: 3
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Environment Options

#### `INPUT_DELETE_TAGS`

| required | default | 
| -------- | -------
| false    | false   |

Specifies whether to delete tags associated to older releases or not. Older tags without any associated releases will not be deleted

Example: 
```
env:
   INPUT_DELETE_TAGS: true
```

### Command Options

#### `keep_latest`

| required |
| -------- |
| true     |

Specifies number of latest releases (sorted by `created_at`) to keep. Pass `0` if you want to delete all releases

#### `repo`

| required | default               |
| -------- | --------------------- |
| false    | repo executing action |

Repo name in the format of `<owner>/<repoName>`. Defaults to the repo that executing this action
