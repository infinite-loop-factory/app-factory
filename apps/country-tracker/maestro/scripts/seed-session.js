// Maestro runScript: obtain Supabase session for E2E test user.
//
// Required maestro env (pass via `maestro test -e KEY=VALUE ...` or shell):
//   MAESTRO_E2E_SUPABASE_URL        e.g. https://xxx.supabase.co
//   MAESTRO_E2E_SUPABASE_ANON_KEY   anon public key
//   MAESTRO_E2E_TEST_EMAIL          test user email (password-grant enabled)
//   MAESTRO_E2E_TEST_PASSWORD       test user password
//
// Outputs (consumed by the next step via ${output.ACCESS_TOKEN}):
//   output.ACCESS_TOKEN
//   output.REFRESH_TOKEN

const url = MAESTRO_E2E_SUPABASE_URL;
const anonKey = MAESTRO_E2E_SUPABASE_ANON_KEY;
const email = MAESTRO_E2E_TEST_EMAIL;
const password = MAESTRO_E2E_TEST_PASSWORD;

const response = http.post(`${url}/auth/v1/token?grant_type=password`, {
  headers: {
    apikey: anonKey,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ email, password }),
});

if (response.status !== 200) {
  throw new Error(`Supabase auth failed: ${response.status} ${response.body}`);
}

const data = json(response.body);
output.ACCESS_TOKEN = data.access_token;
output.REFRESH_TOKEN = data.refresh_token;
