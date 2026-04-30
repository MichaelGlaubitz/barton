function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

function unauthorized(message = 'Unauthorized') {
  return json({ status: 'error', message }, 401);
}

function badRequest(message = 'Bad request') {
  return json({ status: 'error', message }, 400);
}

function methodNotAllowed() {
  return json({ status: 'error', message: 'Method not allowed' }, 405);
}

function pickSlug(payload) {
  if (payload.mode === 'slug' && typeof payload.slug === 'string' && payload.slug.trim().length > 0) {
    return payload.slug.trim();
  }
  if (payload.mode === 'next') {
    return '';
  }
  return null;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== '/hack-optimize') {
      return json({ status: 'error', message: 'Not found' }, 404);
    }

    if (request.method !== 'POST') return methodNotAllowed();

    const incomingToken = request.headers.get('x-automation-token') || '';
    const expectedToken = env.AUTOMATION_TOKEN || '';
    if (!expectedToken || incomingToken !== expectedToken) {
      return unauthorized('Invalid automation token');
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return badRequest('Request body must be valid JSON');
    }

    if (!payload || typeof payload !== 'object') {
      return badRequest('Request body must be an object');
    }

    const slug = pickSlug(payload);
    if (slug === null) {
      return badRequest('Invalid mode/slug combination');
    }

    // NOTE:
    // This free baseline bridge is intentionally simple and safe:
    // - It validates auth + payload
    // - It returns a clear response to GitHub Actions
    // To trigger real optimization, replace this section with:
    // 1) call to your Cursor automation endpoint OR
    // 2) GitHub workflow dispatch call using env.GITHUB_PAT
    const mode = payload.mode || 'next';
    const dryRun = Boolean(payload.dryRun);
    const commit = Boolean(payload.commit);

    const messageParts = ['Bridge erreichbar (kostenloser Cloudflare Worker)'];
    if (mode === 'next') messageParts.push('mode=next');
    if (mode === 'slug') messageParts.push(`slug=${slug}`);
    messageParts.push(`dryRun=${dryRun}`);
    messageParts.push(`commit=${commit}`);

    return json({
      status: 'queued',
      message: messageParts.join(' | '),
      slug,
      runId: `cfw-${Date.now()}`,
    });
  },
};
