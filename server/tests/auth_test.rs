use axum_extra::extract::cookie::Cookie;
use axum_test::TestServer;
use serde_json::json;

mod test_server;

#[tokio::test(flavor = "multi_thread")]
async fn register() {
    let server = test_server::TestServer::new().await;
    let server = &server.server;

    check_good_data(server).await;
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

async fn check_session(
    server: &TestServer,
    cookie: Cookie<'static>,
    name: Option<&str>,
    email: Option<&str>,
    phone: Option<&str>,
) {
    use serde_json::Value;

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
