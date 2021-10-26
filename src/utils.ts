import { Database, open } from "sqlite";

import Git from "nodegit";
import path from "path";
import sqlite3 from "sqlite3";

export function missingEnvVarError(
	variable: string,
	whereToGetTokenFrom: string,
) {
	return new Error(
		`Missing environment variable ${variable.toUpperCase()}. Make sure it's set in your .env file. Get your token ${whereToGetTokenFrom}`,
	);
}

export async function openDatabase(): Promise<
	Database<sqlite3.Database, sqlite3.Statement>
> {
	return new Promise((resolve, reject) => {
		open({
			filename: path.join("data", "informationpedestal.db"),
			driver: sqlite3.Database,
		})
			.then(async (db) => resolve(db))
			.catch(async (err) => reject(err));
	});
}

let gitCommit: {
	hash: { full: string; short: string };
	author: { name: string; email: string };
	message: string;
	date: Date;
};
Git.Repository.open(process.cwd())
	.then((repository) => {
		return repository.getHeadCommit();
	})
	.then((commit) => {
		const date = commit.date();
		const message = commit.message();

		const author = commit.author();
		gitCommit = {
			...gitCommit,
			author: { name: author.name(), email: author.email() },
			message,
			date,
		};
		return commit.sha();
	})
	.then((hash) => {
		gitCommit = {
			...gitCommit,
			hash: {
				full: hash,
				short: hash.slice(0, 7),
			},
		};
	});

export { gitCommit };
