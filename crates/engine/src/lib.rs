use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn engine_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

#[cfg(test)]
mod tests {
    use super::*;
    use wasm_bindgen_test::wasm_bindgen_test;

    #[test]
    fn version_matches_package() {
        assert_eq!(engine_version(), "0.0.0");
    }

    #[wasm_bindgen_test]
    fn version_matches_package_in_wasm() {
        assert_eq!(engine_version(), "0.0.0");
    }
}
