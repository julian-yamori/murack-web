/// 文字列値を SQL で使用する値にエスケープ
pub fn escs(v: &str) -> String {
    //'で囲む 更にSQLインジェクション等対策
    format!("'{}'", v.replace('\'', "''"))
}
