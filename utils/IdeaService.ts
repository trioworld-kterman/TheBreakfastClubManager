import { db } from '../firebase.config';
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  runTransaction,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

const COLLECTION_IDEAS = 'ideas';
const COLLECTION_VOTES = 'votes';

export type IdeaStatus = 'open' | 'planned' | 'done';

export interface Idea {
  id: string;
  title: string;
  description?: string;
  votesUp: number;
  votesDown: number;
  status: IdeaStatus;
  createdAt: Timestamp;
}

export class IdeaService {
  /** Fetches all ideas, sorted by net votes (votesUp - votesDown) descending. */
  static async fetchIdeas(): Promise<Idea[]> {
    const snapshot = await getDocs(collection(db, COLLECTION_IDEAS));
    return snapshot.docs
      .map(d => ({ id: d.id, ...d.data() } as Idea))
      .sort((a, b) => (b.votesUp - b.votesDown) - (a.votesUp - a.votesDown));
  }

  /** Adds a new idea with zero votes and status 'open'. */
  static async submitIdea({ title, description }: { title: string; description?: string }): Promise<void> {
    await addDoc(collection(db, COLLECTION_IDEAS), {
      title,
      description: description ?? '',
      votesUp: 0,
      votesDown: 0,
      status: 'open',
      createdAt: serverTimestamp(),
    });
  }

  /**
   * Casts or toggles a vote on an idea using a Firestore transaction.
   * Vote docs use composite key `{ideaId}_{userId}` to prevent duplicates.
   * Toggling the same voteType removes the vote. Switching voteType removes
   * the old vote and adds the new one — all in a single atomic transaction.
   */
  static async vote(ideaId: string, voteType: 'up' | 'down', userId: string): Promise<void> {
    const voteDocId = `${ideaId}_${userId}`;
    const voteRef = doc(db, COLLECTION_VOTES, voteDocId);
    const ideaRef = doc(db, COLLECTION_IDEAS, ideaId);

    await runTransaction(db, async (tx) => {
      const [voteSnap, ideaSnap] = await Promise.all([tx.get(voteRef), tx.get(ideaRef)]);
      if (!ideaSnap.exists()) return;

      const prevVote = voteSnap.exists() ? (voteSnap.data().voteType as 'up' | 'down') : null;
      const data = ideaSnap.data();
      const counts = { votesUp: data.votesUp ?? 0, votesDown: data.votesDown ?? 0 };

      if (prevVote === voteType) {
        // Toggle off: remove the vote
        tx.delete(voteRef);
        counts[voteType === 'up' ? 'votesUp' : 'votesDown'] = Math.max(0, counts[voteType === 'up' ? 'votesUp' : 'votesDown'] - 1);
      } else {
        // New vote or switch: set vote doc, adjust counts
        tx.set(voteRef, { ideaId, userId, voteType });
        if (prevVote) {
          counts[prevVote === 'up' ? 'votesUp' : 'votesDown'] = Math.max(0, counts[prevVote === 'up' ? 'votesUp' : 'votesDown'] - 1);
        }
        counts[voteType === 'up' ? 'votesUp' : 'votesDown'] += 1;
      }

      tx.update(ideaRef, counts); // single update call avoids last-write-wins issue
    });
  }

  /** Returns a map of ideaId → voteType for all votes cast by this user. */
  static async fetchUserVotes(userId: string): Promise<Record<string, 'up' | 'down'>> {
    const q = query(collection(db, COLLECTION_VOTES), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const result: Record<string, 'up' | 'down'> = {};
    snapshot.docs.forEach(d => {
      const data = d.data();
      result[data.ideaId as string] = data.voteType as 'up' | 'down';
    });
    return result;
  }

  /** Changes the status of an idea (admin only in practice). */
  static async changeStatus(ideaId: string, status: IdeaStatus): Promise<void> {
    await updateDoc(doc(db, COLLECTION_IDEAS, ideaId), { status });
  }

  /**
   * Deletes an idea document.
   * Note: associated vote documents in `votes` are NOT deleted here — they are
   * orphaned and harmless since fetchIdeas will never return the deleted idea.
   */
  static async deleteIdea(ideaId: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION_IDEAS, ideaId));
  }
}
