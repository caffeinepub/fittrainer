import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Order "mo:core/Order";

actor {
  type UserId = Principal;

  // Describe a workout session
  type WorkoutLog = {
    id : Text;
    userId : UserId;
    exercises : [Text];
    repetitions : [Nat];
    timestamp : Time.Time;
    durationMinutes : Nat;
  };

  // Represent a user statistics profile
  type Statistics = {
    id : Text; // UUID as Text
    userId : UserId;
    created : Time.Time;
    bio : Text;
    heightCm : Int;
    weightKg : Int;
    activeMinutes : Nat;
    calorieIntakeAvg : Int;
  };

  module WorkoutLog {
    public func compare(log1 : WorkoutLog, log2 : WorkoutLog) : Order.Order {
      Text.compare(log1.id, log2.id);
    };
  };

  module Statistics {
    public func compare(stat1 : Statistics, stat2 : Statistics) : Order.Order {
      Text.compare(stat1.id, stat2.id);
    };
  };

  let workoutLogs = Map.empty<Text, WorkoutLog>();
  let userStats = Map.empty<UserId, Statistics>();

  public query ({ caller }) func getWorkoutLog(logId : Text) : async WorkoutLog {
    switch (workoutLogs.get(logId)) {
      case (null) { Runtime.trap("Workout log does not exist.") };
      case (?log) { log };
    };
  };

  public query ({ caller }) func getAllWorkoutLogs() : async [WorkoutLog] {
    workoutLogs.values().toArray().sort();
  };

  public shared ({ caller }) func saveWorkoutLog(log : WorkoutLog) : async () {
    workoutLogs.add(log.id, log);
  };

  public shared ({ caller }) func saveStats(stats : Statistics) : async () {
    userStats.add(stats.userId, stats);
  };

  public query ({ caller }) func getStats(userId : UserId) : async ?Statistics {
    userStats.get(userId);
  };

  public query ({ caller }) func getAllStats() : async [Statistics] {
    userStats.values().toArray().sort();
  };
};
