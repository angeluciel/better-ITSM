# Enforce Branch Naming
## Objetivo
Esta regra tem como objetivo padronizar os nomes das branches do repositório, permitindo apenas branches que sigam os prefixos definidos pela equipe.

## Branches Permitidas
As seguintes branches ou padrões de branches são permitidos:

```diff
+ main
+ dev
+ hotfix/*
+ bugfix/*
+ fix/*
+ docs/*
+ docs/**/*
+ test
+ test/*
+ refactor/*
+ feature/*
```

## Regras aplicadas
Para branches que não seguem os padrões, o ruleset bloqueia:
```diff
- Criação de branch 
- Exclusão da branch 
- Push com non-fast-forward 
```
