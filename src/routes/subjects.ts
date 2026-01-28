import express from 'express';
import { db } from '../db';
import { departments, subjects } from '../db/schema';
import { ilike, or, eq, and, sql, getTableColumns } from 'drizzle-orm';
import { get } from 'node:http';
import { desc } from 'drizzle-orm';


const router = express.Router();

// Get all subjects with optional search, filtering and pagination
router.get('/', async (req, res) => {
    try {
        const { search, department, page = 1, limit = 10 } = req.query;

        const currentPage = Math.max(1, +page);
        const limitPage = Math.max(1, +limit);

        const offset = (currentPage - 1) * limitPage;

        const filterConditions = [];

        //if search query exists, filter by subject name OR code 
        if (search) {
            filterConditions.push(
                or(
                    ilike(subjects.name, `%${search}%`),
                    ilike(subjects.code, `%${search}%`)
                )
            );
        }
        // if departement exists, filter by department name
        if (department) {
            filterConditions.push(
                ilike(departments.name, `%${department}%`)
            );
        }

        //Comibine all filter conditions using AND
        const whereCondition = filterConditions.length > 0 ? and(...filterConditions) : undefined;


        const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(subjects)
            .leftJoin(departments, eq(subjects.departmentId, departments.id))
            .where(whereCondition);



        const totalCount = countResult[0]?.count || 0;
        const subjectsList = await db.select({ ...getTableColumns(subjects), department: { ...getTableColumns(departments) } }).from(subjects).leftJoin(departments, eq(subjects.departmentId, departments.id))
            .where(whereCondition)
            .orderBy(desc(subjects.createAt))
            .limit(limitPage)
            .offset(offset);


        res?.status(200).json({
            data: subjectsList,
            pagination: {

                page: currentPage,
                limit: limitPage,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limitPage),

            }
        });
    } catch (error) {
        console.error('Error in /subjects route:', error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;