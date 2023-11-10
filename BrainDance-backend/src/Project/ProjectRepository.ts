import { type PostProjectObjectType, type ProjectSelectRow } from "../interface/project";
import { type FieldPacket, type PoolConnection } from "mysql2/promise";
import { type ResultSetHeader } from '../interface/response';
import pool from '../database/database';

export const insertProjectRow = async (data: PostProjectObjectType): Promise<number> => {
    try {
        const connection: PoolConnection = await pool.getConnection();
        const insertQuery: string = `
            INSERT INTO Project 
            (projectTitle, createdAt, originText, summaryText, uid) 
            VALUES 
            (?, NOW(), ?, ?, ?)`;
        const [ProjectRowInfo]: [any[], FieldPacket[]] = await connection.execute(insertQuery, [
            data.projectTitle,
            data.originText,
            data.summaryText,
            data.uid]);
        connection.release();
        const insertId: number = (ProjectRowInfo as unknown as ResultSetHeader).insertId;
        return insertId;
    } catch(err) {
        console.log(err);
        throw err;
    }
}

export const selectProjectRow = async (): Promise<ProjectSelectRow[]> => {
    try {
        const connection: PoolConnection = await pool.getConnection();
        const selectQuery: string = 'SELECT id, projectTitle, createdAt, uid FROM Project';
        const [projectRows]: [ProjectSelectRow[], FieldPacket[]] = await connection.execute(selectQuery);
        connection.release();

        return projectRows;

    } catch(err) {
        console.log(err);
        throw err;
    }
}