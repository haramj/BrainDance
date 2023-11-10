import { type PostProjectObjectType, type GetProjectsObjectType, type ProjectSelectRow } from "../interface/project";
import { type UidToUserInfo } from '../interface/user';
import { insertProjectRow, selectProjectRow } from '../Project/ProjectRepository';
import { selectKeywordRows } from '../Keyword/KeywordRepository';
import { admin } from "../auth/firebase";

export const insertProject = async (data: PostProjectObjectType): Promise<number> => {
    try {
        const projectId: number = await insertProjectRow(data);
        return projectId;
    } catch(err) {
        console.log(err);
        throw err;
    }
}

export const selectProjects = async (): Promise<GetProjectsObjectType[]> => {
    try {
        const projectRows: ProjectSelectRow[] = await selectProjectRow();

        const response: GetProjectsObjectType[] = [];
        for (const projectRow of projectRows){
            const userInfo: UidToUserInfo = await admin.auth().getUser(projectRow.uid);
            const keywords: string[] = await selectKeywordRows(projectRow.id);
            if (typeof userInfo.uid === 'string'){
                const item: GetProjectsObjectType = {
                    projectId: projectRow.id,
                    projectTitle: projectRow.projectTitle,
                    createdAt: projectRow.createdAt,
                    keyword: keywords,
                    displayName: userInfo.displayName
                }
                response.push(item);
            }
        }
        return response;

    } catch(err) {
        console.log(err);
        throw err;
    }
}