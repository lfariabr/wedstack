import Project from '../../models/Project';
import { checkRole } from '../../utils/authUtils';

export const projectMutations = {
  createProject: async (_: any, { input }: any, context: any) => {
    // Check if user is admin
    checkRole(context, 'ADMIN');
    
    const project = new Project(input);
    await project.save();
    return project;
  },
  
  updateProject: async (_: any, { id, input }: any, context: any) => {
    // Check if user is admin
    checkRole(context, 'ADMIN');
    
    return await Project.findByIdAndUpdate(
      id,
      { $set: input },
      { new: true, runValidators: true }
    );
  },
  
  deleteProject: async (_: any, { id }: { id: string }, context: any) => {
    // Check if user is admin
    checkRole(context, 'ADMIN');
    
    const result = await Project.findByIdAndDelete(id);
    return !!result;
  },
};