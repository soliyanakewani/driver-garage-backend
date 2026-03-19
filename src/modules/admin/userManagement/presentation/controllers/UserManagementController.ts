import { Request, Response } from "express";
import { PrismaUserRepository } from "../../infrastructure/prisma/PrismaUserRepository";
import { ListUsersUseCase } from "../../application/usecases/ListUsersUseCase";
import { BlockUserUseCase } from "../../application/usecases/BlockUserUseCase";
import { WarnUserUseCase } from "../../application/usecases/WarnUserUseCase";
import { ActivateUserUseCase } from "../../application/usecases/ActivateUserUseCase";
import { DeleteUserUseCase } from "../../application/usecases/DeleteUserUseCase";
import { GetUserStatsUseCase } from "../../application/usecases/GetUserStatsUseCase";

import { ListUsersDto } from "../../application/dto/ListUsersDto";
import { BlockUserDto } from "../../application/dto/BlockUserDto";
import { WarnUserDto } from "../../application/dto/WarnUserDto";
import { ActivateUserDto } from "../../application/dto/ActivateUserDto";
import { DeleteUserDto } from "../../application/dto/DeleteUserDto";
import { UserStatsResponseDto } from "../../application/dto/GetUserStatsDto";

const repo = new PrismaUserRepository();

export class UserManagementController {
    
  static async listUsers(req: Request, res: Response) {
    const usecase = new ListUsersUseCase(repo);
    const dto: ListUsersDto = {
      search: req.query.search ? String(req.query.search) : "",
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10
    };

    console.log("Search value:", dto.search);
    const users = await usecase.execute(dto);
    res.json(users);
  }

   static async getStats(req: Request, res: Response) {
    const usecase = new GetUserStatsUseCase(repo);
    const stats = await usecase.execute();
    res.json(stats);
}


  static async blockUser(req: Request, res: Response) {
    const { id } = req.params;
    const { role } = req.body;

    const dto: BlockUserDto = {
      userId: String(req.params.id),
      role: String(req.body.role)
    };

    const useCase = new BlockUserUseCase(repo);
    await useCase.execute(dto);
    res.json({ message: "User blocked successfully" });
  }

static async warnUser(req: Request, res: Response) {
  const  {id}  = req.params;
  const { role } = req.body;

  const dto: WarnUserDto = {
    userId: String(req.params.id),
    role: String(req.body.role)
  };

  const useCase = new WarnUserUseCase(repo);
  await useCase.execute(dto);
  res.json({ message: "User warned successfully" });
}

static async activateUser(req: Request, res: Response) {
  const  {id}  = req.params;
  const { role } = req.body;

  const dto: ActivateUserDto = {
    userId: String(req.params.id),
    role: String(req.body.role)
  };

  const useCase = new ActivateUserUseCase(repo);
  await useCase.execute(dto);

  res.json({ message: "User activated successfully" });
}

static async deleteUser(req: Request, res: Response) {
  const { id } = req.params;
  const { role } = req.body;

  const dto: DeleteUserDto = {
    userId: String(req.params.id),
    role: String(req.body.role)
  };

  const useCase = new DeleteUserUseCase(repo);
  await useCase.execute(dto);

  res.json({ message: "User deleted successfully" });
}
}
