## Run Development (Local)
```
  yarn install
  yarn start
```
Using make:
```
  make start
```

## Deploy Firebase
```
  yarn run build
  firebase login
  firebase deploy --only hosting:tien-ich-sv
```
Using make:
```
  make deploy
```