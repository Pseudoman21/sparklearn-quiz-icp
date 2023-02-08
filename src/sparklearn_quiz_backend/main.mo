import List "mo:base/List";
import Option "mo:base/Option";
import Trie "mo:base/Trie";
import Nat32 "mo:base/Nat32";

actor {
  public query func greet(name : Text) : async Text {
    return "Hello, " # name # "!";
  };

  // This allows us to generate leaderboard //
   /**
   * Types
   */

  // The type of a user identifier.
  public type UserId = Nat32;

  // The type of a user.
  public type Leaderboard = {
    name : Text;
    email : Text;
    score : Nat32;
  };

  /**
   * Application State
   */

  // The next available user identifier.
  private stable var next : UserId = 0;

  // The user data store.
  private stable var leaderboard : Trie.Trie<UserId, Leaderboard> = Trie.empty();

  /**
   * High-Level API
   */

  // Create a user.
  public func create(user : Leaderboard) : async UserId {
    let userId = next;
    next += 1;
    leaderboard := Trie.replace(
      leaderboard,
      key(userId),
      Nat32.equal,
      ?user,
    ).0;
    return userId;
  };

  // Read a user.
  public query func read(userId : UserId) : async ?Leaderboard {
    let result = Trie.find(leaderboard, key(userId), Nat32.equal);
    return result;
  };

  // Update a user.
  public func update(userId : UserId, user : Leaderboard) : async Bool {
    let result = Trie.find(leaderboard, key(userId), Nat32.equal);
    let exists = Option.isSome(result);
    if (exists) {
      leaderboard := Trie.replace(
        leaderboard,
        key(userId),
        Nat32.equal,
        ?user,
      ).0;
    };
    return exists;
  };

  // Delete a user.
  public func delete(userId : UserId) : async Bool {
    let result = Trie.find(leaderboard, key(userId), Nat32.equal);
    let exists = Option.isSome(result);
    if (exists) {
      leaderboard := Trie.replace(
        leaderboard,
        key(userId),
        Nat32.equal,
        null,
      ).0;
    };
    return exists;
  };

  /**
   * Utilities
   */

  // Create a trie key from a user identifier.
  private func key(x : UserId) : Trie.Key<UserId> {
    return { hash = x; key = x };
  };

  // End of leaderboard //

};
