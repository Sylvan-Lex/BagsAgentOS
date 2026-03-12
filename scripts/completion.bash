# BagsAgentOS Bash 自动补全

_bags_completions() {
  local cur prev
  COMPREPLY=()
  cur="${COMP_WORDS[COMP_CWORD]}"
  prev="${COMP_WORDS[COMP_CWORD-1]}"

  commands="agent claim:fees config:init config:show config:set config:set-bags config:export launch:token search:token status tokens:popular trade:swap version wallet:balance wallet:list"

  if [[ ${cur} == -* ]]; then
    COMPREPLY=($(compgen -W "--help --version" -- ${cur}))
    return 0
  fi

  COMPREPLY=($(compgen -W "${commands}" -- ${cur}))
  return 0
}

complete -F _bags_completions bags
