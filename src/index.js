export default {
    async fetch(req) {
        const { default: defaultExport, foo, bar, baz } = await import('./a.cjs');
        return new Response(
            `
            declared named export foo (should be __foo__): ${foo}
            declared named export bar (should be __bar__): ${bar}
            undeclared named export baz (should be undefined): ${baz}
            `.replace(/\n\s+/g, '\n\n')
        );
    }
}