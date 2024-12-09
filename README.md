# Proba it

## Instructiuni de rulare

### Backend

#### Setup

Pentru backend este nevoie de rust instalat. Pe linux/mac metoda recomandata de instalare este:
```sh
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
Pe ubuntu se poate instala si prin comanda
```sh
sudo apt install cargo
```

[Mai multe detalii aici](https://rustup.rs/)

#### Rulare

Serverul are nevoie de environment variable pentru url-ul bazei de date si optional pentru nivelul de loguri. Variabilele pot fi setate si in fisierul .env (vezi server/.env.example)

Pentru rulare
```
cargo run
```

Pentru rulare cu nivel setat de logging
```
RUST_LOG=warn cargo run
```

### Frontend

```
npm install
npm run dev
```