import { type PostProjectObjectType, type ProjectSelectRow, type ProjectSelectWhereUidRow } from "../interface/project";
import { type FieldPacket, type PoolConnection } from "mysql2/promise";
import { type ResultSetHeader } from '../interface/response';
import pool from '../database/database';

export const insertProjectRow = async (data: PostProjectObjectType): Promise<number> => {
    try {
        const connection: PoolConnection = await pool.getConnection();
        const insertQuery: string = `
            INSERT INTO Project 
            (projectTitle, createdAt, originText, uid) 
            VALUES 
            (?, NOW(), ?, ?)`;
        const [ProjectRowInfo]: [any[], FieldPacket[]] = await connection.execute(insertQuery, [
            data.projectTitle,
            data.originText,
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

export const selectProjectWhereUidRow = async (projectId: number): Promise<ProjectSelectWhereUidRow> => {
    try {
        const connection: PoolConnection = await pool.getConnection();
        const selectQuery: string = 'SELECT * FROM Project WHERE id = ?';
        const [projectRow]: [ProjectSelectWhereUidRow[], FieldPacket[]] = await connection.execute(selectQuery,[projectId]);
        connection.release();

        return projectRow[0];

    } catch(err) {
        console.log(err);
        throw err;
    }
}

export const updateProjectSummary = async (summaryText: string, projectId: number): Promise<void> => {
    try {
        console.log(summaryText)
        console.log(projectId)
        const connection: PoolConnection = await pool.getConnection();
        const updateQuery: string = 'UPDATE Project SET summaryText = ? WHERE id = ?';
        await connection.execute(updateQuery,[summaryText, projectId]);
        connection.release();

    } catch(err) {
        console.log(err);
        throw err;
    }
}