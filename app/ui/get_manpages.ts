"use server";

import { readdir, readFile } from "fs/promises";
import path from "path";

const MAN8_DIR = path.join(process.cwd(), "man8_copy");

// Cache the list of available man pages
let manPageCache: Set<string> | null = null;

/**
 * Get set of all available man page names (without .8 extension)
 */
export async function getManPageNames(): Promise<Set<string>> {
	if (manPageCache) {
		return manPageCache;
	}

	try {
		const files = await readdir(MAN8_DIR);
		manPageCache = new Set(
			files
				.filter((f) => f.endsWith(".8"))
				.map((f) => f.replace(/\.8$/, ""))
		);
		return manPageCache;
	} catch (err) {
		console.error("Failed to read man8_copy directory:", err);
		return new Set();
	}
}

/**
 * Get list of man page names as array (for client use)
 */
export async function getManPageList(): Promise<string[]> {
	const names = await getManPageNames();
	return Array.from(names);
}

/**
 * Extract basename from a command path
 * e.g., "/usr/sbin/sshd" -> "sshd"
 * e.g., "sshd -D" -> "sshd"
 */
export async function getBasename(cmd: string): Promise<string> {
	const execPath = cmd.split(/\s+/)[0];
	return path.basename(execPath);
}

/**
 * Check if a process command has a corresponding man page
 */
export async function hasManPage(cmd: string): Promise<boolean> {
	const manPages = await getManPageNames();
	return manPages.has(getBasename(cmd));
}

/**
 * Get the content of a man page by name
 */
export async function getManPageContent(name: string): Promise<string | null> {
	try {
		const filePath = path.join(MAN8_DIR, `${name}.8`);
		return await readFile(filePath, "utf-8");
	} catch (err) {
		console.error(`Failed to read man page for ${name}:`, err);
		return null;
	}
}
