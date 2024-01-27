import { prisma } from '$lib/server/prisma.js';

export async function load() {
	const movies = await prisma.filme.findMany({ include: { status: { select: { id: true } } } })
	return { movies }
}
