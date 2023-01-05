import  logger from "../../../../logger/logger.js";
import { HttpException, HttpResponse } from "../../../../utils/index.js";
import TeamService from "../../../../services/Team.service.js";
import mongoose from "mongoose";
class TeamController {
    createTeam(request, response, next) {
        try {
            const Team = request.body;
             
            TeamService.createTeam(Team, (err, result) => {
                if (err) {
                    next(new HttpException(400, err));
                } else {
                    response.status(200).send(new HttpResponse("CreateTeam", result, "Team Created", null, null, null));
                }
            });
        } catch (err) {
            logger.error("CreateTeamController->", err);
            next(new HttpException(400, "Something went wrong"));
        }
    }

    updateTeam(request, response, next) {
        try {
            const Team = request.body;
            
            const id = request.params.id;
            TeamService.updateTeam(id ,Team, (err, result) => {
                if (err) {
                    next(new HttpException(400, err));
                } else {
                    response.status(200).send(new HttpResponse("UpdateTeam", result, "Team Updated", null, null, null));
                }
            });
        } catch (err) {
            logger.error("UpdateTeamController->", err);
            next(new HttpException(400, "Something went wrong"));
        }
    }
    

    

    
    

    deleteTeam(request, response, next) {
        try {
            const id = request.params.id;
            TeamService.deleteTeam(id,(err, result) => {
                if (err) {
                    next(new HttpException(400, err));
                } else {
                    response.status(200).send(new HttpResponse("DeleteTeam", result, "Team Deleted", null, null, null));
                }
            });
        } catch (err) {
            logger.error("DeleteTeamController->", err);
            next(new HttpException(400, "Something went wrong"));
        }
    }

    async getTeams(request, response, next) {
        try {
           
            
            const query = request.query;
            
            const sort = {};
            const projections = {};
            let options = {
                limit: 0,
                pageNo: 0
            };
            // eslint-disable-next-line prefer-const
            let { limit, pageNo, sortBy, orderBy, ...clauses } = query;
            if (query.limit, query.pageNo) {
                options = { limit: parseInt(limit ), pageNo: parseInt(pageNo ) };
                delete clauses.limit; delete clauses.pageNo;
            }
            if (sortBy && orderBy) {
                sort[sortBy ] = orderBy === "desc" ? -1 : 1;
            }
            if (clauses.searchTerm && clauses.searchValue) {
                const searchTerm = {};
                searchTerm[clauses.searchTerm ] = new RegExp(`^${clauses.searchValue}`, "i");
                clauses = { ...clauses, ...searchTerm };
                delete clauses.searchTerm, delete clauses.searchValue;
            }
            
            TeamService.getTeams(clauses, projections, options, sort, (err, result) => {
                if (err) {
                    next(new HttpException(400, err));
                } else {
                    response.status(200).send(new HttpResponse("GetTeam", result.results, "Teams Returned", null, result.totalResult, null));
                }
            });
        } catch (err) {
            logger.error("GetTeamsController->", err);
            next(new HttpException(400, "Something went wrong"));
        }
    }

    async getTeamById(request, response, next) {
      try {
         
          
          const query = request.query;
          query._id =mongoose.Types.ObjectId(request.params.id)
          
          const projections = {};
         
          // eslint-disable-next-line prefer-const
          let { limit, pageNo, ...clauses } = query;
         
          if (clauses.searchTerm && clauses.searchValue) {
              const searchTerm = {};
              searchTerm[clauses.searchTerm ] = new RegExp(`^${clauses.searchValue}`, "i");
              clauses = { ...clauses, ...searchTerm };
              delete clauses.searchTerm, delete clauses.searchValue;
          }
          
          TeamService.getTeamById(clauses, projections, (err, result) => {
              if (err) {
                  next(new HttpException(400, err));
              } else {
                  response.status(200).send(new HttpResponse("GetTeam", result.results, "Team Returned", null, result.totalResult, null));
              }
          });
      } catch (err) {
          logger.error("GetTeamsController->", err);
          next(new HttpException(400, "Something went wrong"));
      }
  }

   
}

export default new TeamController();