# Proba-IT-2024-Template

### Acest template public poate fi folosit pentru a vă crea repository-ul pentru proba tehnică. El permite și crearea automată de issue-uri, în concordanță cu task-urile probei:
* Homepage
* Profile
* Register & Login
* Add Recipes Page
* Recipes Page & Search

### Pentru a crea un repo privat și pentru a rula workflow-ul pentru issue-uri, se vor urma pașii de mai jos:
* Repository privat:
    * În colțul din dreapta-sus, apasă pe butonul „Use this template”, apoi pe cel de „Create a new repository” pentru a crea un repository în contul tău de GitHub.
* Adaugă token-ul tău de GitHub la Repository Secrets:
    * În repo-ul tău, mergi la secțiunea de „Settings”.
    * Selectează „Secrets and variables” > „Actions” > „New repository secret”.
    * Creează un secret nou, cu numele „TOKEN”, și introdu token-ul de acces personal. Mai multe detalii [aici](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic).
* Rulează workflow-ul:
    * Mergi la secțiunea „Actions” din repository-ul tău.
    * Selectează „Initialise Repo” > „Run workflow”.
    * După ce workflow-ul va termina de rulat, la secțiunea de „Issues” vor apărea cele 5 issue-uri menționate mai sus.
