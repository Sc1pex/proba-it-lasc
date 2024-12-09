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

## Descriere

Feature-uri implementate:

- Homepage cu cele 3 retete cu cel mai mare rating si formul de contact
- Pagini de register/login cu validarea datelor (si pe client si pe server)
- Autentificare prin session cookies
- Pagina de profil
- Pagina pentru crearea retetelor
- Stocarea imaginilor pentru retete in baza de date
- Pagina pentru vizualizarea retetelor
- Filtrarea si sortarea retetelor in functie de rating
- Popup pentru fiecare reteta unde se poate lasa un rating
- Endpointuri pentru lasarea unui rating si pentru gasirea unui rating

Feature-uri neimplementate:

- Ui mobile

### Descriere Backend

Backendul este scris in rust si am folosit libraria [axum](https://github.com/tokio-rs/axum) pentru serverul de http. Pentru baza de date am folosit PostgreSQL cu libraria [sqlx](https://github.com/launchbadge/sqlx).

### Descriere Frontend

Frontendul este facut cu Vite si React+Typescript