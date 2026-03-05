import { Request, Response } from "express";
import { PrismaUserRepository } from "../../infrastructure/prisma/PrismaUserRepository";
import { ListUsersUseCase } from "../../application/usecases/ListUsersUseCase";
import { BlockUserUseCase } from "../../application/usecases/BlockUserUseCase";
import { WarnUserUseCase } from "../../application/usecases/WarnUserUseCase";
import { ActivateUserUseCase } from "../../application/usecases/ActivateUserUseCase";
import { DeleteUserUseCase } from "../../application/usecases/DeleteUserUseCase";
import { GetUserStatsUseCase } from "../../application/usecases/GetUserStatsUseCase";

const repo = new PrismaUserRepository();

export class UserManagementController {
    
  static async listUsers(req: Request, res: Response) {
    const search = req.query.search as string | undefined;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    console.log("Search value:", search);
    const useCase = new ListUsersUseCase(repo);
    const users = await useCase.execute(search, page, limit);
    res.json(users);
  }

   static async getStats(req: Request, res: Response) {
    const useCase = new GetUserStatsUseCase(repo);
    const stats = await useCase.execute();
    res.json(stats);
}


  static async blockUser(req: Request, res: Response) {
    const id  = req.params.id as string;
    const { role } = req.body;

    const useCase = new BlockUserUseCase(repo);
    await useCase.execute(id, role);
    res.json({ message: "User blocked successfully" });
  }

static async warnUser(req: Request, res: Response) {
  const  id  = req.params.id as string;
  const { role } = req.body;

  const useCase = new WarnUserUseCase(repo);
  await useCase.execute(id, role);

  res.json({ message: "User warned successfully" });
}

static async activateUser(req: Request, res: Response) {
  const  id  = req.params.id as string;
  const { role } = req.body;

  const useCase = new ActivateUserUseCase(repo);
  await useCase.execute(id, role);

  res.json({ message: "User activated successfully" });
}

static async deleteUser(req: Request, res: Response) {
  const id = req.params.id as string;
  const { role } = req.body;

  const useCase = new DeleteUserUseCase(repo);
  await useCase.execute(id, role);

  res.json({ message: "User deleted successfully" });
}
}
