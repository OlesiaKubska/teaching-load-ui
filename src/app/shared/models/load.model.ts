export interface Load {
  _id: string;
  teacherId: string;
  subjectId: string;
  group: string;
  type: 'lecture' | 'practice';
  hours: number;
  year: number;
}