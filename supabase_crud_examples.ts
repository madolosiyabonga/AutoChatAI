import { supabase } from './src/lib/supabaseClient';

/* 
  ===========================================
  SUPABASE CRUD EXAMPLES
  ===========================================
  These are simple, clean, copy-paste snippets for managing tasks and transactions as requested.
*/

// --- TASKS CRUD ---

/**
 * Loading Tasks
 */
export async function getTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) console.error(error);
  return data;
}

/**
 * Creating a New Task
 */
export async function createTask(title: string, description: string, reward: number, duration: string, difficulty: string, icon: string) {
  const { data, error } = await supabase
    .from('tasks')
    .insert([{
      title,
      description,
      reward,
      duration,
      difficulty,
      icon
    }])
    .select();

  if (error) console.error(error);
  return data;
}

/**
 * Updating a Task
 */
export async function updateTask(id: string, updates: Partial<{ title: string, description: string, reward: number }>) {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) console.error(error);
  return data;
}

/**
 * Deleting a Task
 */
export async function deleteTask(id: string) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) console.error(error);
}

// --- TRANSACTIONS (User specific data) CRUD ---

/**
 * Loading User's Transactions
 */
export async function getUserTransactions(userId: string) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) console.error(error);
  return data;
}

/**
 * Creating a New Transaction
 */
export async function createTransaction(userId: string, title: string, amount: number, type: 'earn' | 'withdraw') {
  const { data, error } = await supabase
    .from('transactions')
    .insert([{
      user_id: userId,
      title,
      amount,
      type
    }])
    .select();

  if (error) console.error(error);
  return data;
}
