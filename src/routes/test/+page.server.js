export const actions = {
    create: async ({ request }) => {
        const data = await request.formData();
        console.log('oi', data)
        return { msg: 'hi', data: Array.from(data.entries()) }
    }
};