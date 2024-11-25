use axum_extra::extract::cookie::Cookie;
use axum_test::TestServer;
use serde_json::json;
use serde_json::Value;

mod test_server;

#[tokio::test(flavor = "multi_thread")]
async fn register() {
    let server = test_server::TestServer::new().await;
    let server = &server.server;

    check_good_data(server).await;
    check_bad_email(server).await;
    check_duplicate_email(server).await;
    check_invalid_password(server).await;
    check_phone_validation(server).await;
}

async fn check_good_data(server: &TestServer) {
    let resp = server
        .post("/register")
        .json(&json!({
            "name": "abc",
            "phone": "123",
            "email": "a@a.com",
            "password": "abcdef123"
        }))
        .await;

    resp.assert_status_ok();
    let session = resp.cookie("session_id");

    check_session(server, session, Some("abc"), Some("a@a.com"), Some("123")).await;
}

async fn check_bad_email(server: &TestServer) {
    let resp = server
        .post("/register")
        .json(&json!({
            "name": "abc",
            "phone": "123",
            "email": "aa.com",
            "password": "abcdef123"
        }))
        .await;

    resp.assert_status_ok();
    let json: Value = resp.json();
    assert!(json.get("email").is_some());
}

async fn check_duplicate_email(server: &TestServer) {
    let resp = server
        .post("/register")
        .json(&json!({
            "name": "abc",
            "phone": "123",
            "email": "a@a.com",
            "password": "abcdef123"
        }))
        .await;

    resp.assert_status_ok();
    let json: Value = resp.json();
    assert!(json.get("email").is_some());
}

async fn check_invalid_password(server: &TestServer) {
    let resp = server
        .post("/register")
        .json(&json!({
            "name": "abc",
            "phone": "123",
            "email": "b@b.com",
            "password": "abcd"
        }))
        .await;

    resp.assert_status_ok();
    let json: Value = resp.json();
    assert!(json.get("password").is_some());
}

async fn check_phone_validation(server: &TestServer) {
    let phone_values = vec![
        ("123", true),
        ("+234", true),
        ("+32a", false),
        ("23ds432", false),
        ("123+34", false),
    ];
    for (i, (phone, valid)) in phone_values.iter().enumerate() {
        let resp = server
            .post("/register")
            .json(&json!({
                "name": "abc",
                "phone": phone,
                "email": format!("{i}@a.com"),
                "password": "abcabcabc"
            }))
            .await;

        resp.assert_status_ok();
        if !*valid {
            assert!(
                !resp.text().is_empty(),
                "expected {} to be an invalid phone number, but was valid",
                phone
            );
            let json: Value = resp.json();
            assert!(json.get("password").is_some() == *valid);
        }
    }
}

async fn check_session(
    server: &TestServer,
    cookie: Cookie<'static>,
    name: Option<&str>,
    email: Option<&str>,
    phone: Option<&str>,
) {
    let resp: Value = server.get("/user").add_cookie(cookie).await.json();

    if name.is_some() {
        assert_eq!(resp.get("name").and_then(|n| n.as_str()), name);
    }
    if email.is_some() {
        assert_eq!(resp.get("email").and_then(|n| n.as_str()), email);
    }
    if phone.is_some() {
        assert_eq!(resp.get("phone").and_then(|n| n.as_str()), phone);
    }
}
