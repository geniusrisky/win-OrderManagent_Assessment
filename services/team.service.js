import logger from "../logger/logger.js";
import { Team } from "../Models/Team.entity.js";

import CrudOperations from "../utils/db/mongo.crud.js";
import _ from "lodash";
//import { Types } from "mongoose";

class TeamService {
  /**
   * @method:  Create Team.
   */

  async createTeam(TeamDoc, next) {
    try {
      const similarTeam = await new CrudOperations(Team).getDocument(
        { name: TeamDoc.name, isDeleted: false },
        {}
      );
      if (similarTeam) {
        return next("Team already exists");
      }
      TeamDoc.isDeleted = false;
      const team = new Team(TeamDoc);
      await new CrudOperations(Team)
        .save(team)
        .then((result) => {
          next(null, result);
        })
        .catch((error) => {
          next(error);
        });
    } catch (err) {
      logger.error("CreateTeams->", err);
      next("Something went wrong");
    }
  }

  
  async updateTeam(id, TeamDoc, next) {
    try {
      const oldTeamDoc = await new CrudOperations(Team).getDocument(
        { _id: id, isDeleted: false },
        {}
      );

      const updatedTeamDoc = _.extend(oldTeamDoc, TeamDoc);

      await new CrudOperations(Team)
        .save(updatedTeamDoc)
        .then((result) => {
          next(null, result);
        })
        .catch((error) => {
          next(error);
        });
    } catch (err) {
      logger.error("Update Teams->", err);
      next("Something went wrong");
    }
  }

  //   /**
  //    * @method:  Delete Team.
  //    */
  async deleteTeam(id, next) {
    try {
      const team = await new CrudOperations(Team).getDocument(
        { _id: id, isDeleted: false },
        {}
      );
      if (team) {
        team.isDeleted = true;
        const deletedTeam = await new CrudOperations(Team).updateDocument(
          { _id: id },
          team
        );
        next(null, deletedTeam);
      } else {
        next("No Team Found To Delete!");
      }
    } catch (err) {
      logger.error("DeleteTeam->", err);
      next("Something went wrong");
    }
  }

  //   /**
  //    * @method:  Get Team.
  //    */
  async getTeams(clauses, projections, options, sort, next) {
    try {
      clauses.isDeleted = false;
      const totalResult = await new CrudOperations(Team).countAllDocuments(
        clauses
      );
      const results = await new CrudOperations(Team).getAllDocuments(
        clauses,
        projections,
        options,
        sort
      );

      const response = { results: results, totalResult: totalResult };
      logger.info(response);
      next(null, response);
    } catch (err) {
      logger.info(err);

      logger.error("GetTeam-> ", err);
      logger.info(err);
      next("Something went wrong");
    }
  }

  async getTeamById(clauses, projections,  next) {
    try {
      clauses.isDeleted = false;
      
      const results = await new CrudOperations(Team).getDocument(
        clauses,
        projections,
       
      );

      const response = { results: results };
      logger.info(response);
      next(null, response);
    } catch (err) {
      logger.info(err);

      logger.error("GetTeam-> ", err);
      logger.info(err);
      next("Something went wrong");
    }
  }
}

export default new TeamService();
