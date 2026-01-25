import { serial, pgTable, varchar, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

const timestamps = {
    createAt: timestamp('create_at').defaultNow().notNull(),
    updateAt: timestamp('update_at').defaultNow().notNull(),
}

export const departments = pgTable('departments', {
    id: serial('id').primaryKey(),
    code: varchar('code', { length: 50 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    description: varchar('description', { length: 500 }),
    ...timestamps,
})


export const subjects = pgTable('subjects', {
    id: serial('id').primaryKey(),
    departmentId: integer('department_id').notNull().references(() => departments.id, { onDelete: 'cascade' }),
    code: varchar('code', { length: 50 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    description: varchar('description', { length: 255 }),
    ...timestamps,
})



export const departmentRelations = relations(departments, ({ many }) => ({
    subjects: many(subjects),
}));


export const subjectsRelations = relations(subjects, ({ one }) => ({
    department: one(departments, {
        fields: [subjects.departmentId],
        references: [departments.id],
    }),
}));


export type Department = typeof departments.$inferSelect;
export type NewDepartment = typeof departments.$inferInsert;
export type Subject = typeof subjects.$inferSelect;
export type NewSubject = typeof subjects.$inferInsert;






