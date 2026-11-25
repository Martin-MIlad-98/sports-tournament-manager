// Small fetch wrapper: sends/receives JSON and turns server errors into Error(message).
export async function api(path, { method = 'GET', body } = {}) {
  const options = { method, headers: { 'Content-Type': 'application/json' } };
  if (body !== undefined) options.body = JSON.stringify(body);

  let response;
  try {
    response = await fetch(`/api${path}`, options);
  } catch {
    throw new Error('Cannot reach the server. Is it running?');
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    /* empty or non-JSON body */
  }
  if (!response.ok) {
    throw new Error(data?.error || `Request failed (${response.status}).`);
  }
  return data;
}
