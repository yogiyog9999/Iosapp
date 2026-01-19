import { Injectable } from '@angular/core';
import { supabase } from './supabase.client';

@Injectable({ providedIn: 'root' })
export class ReviewService {
 async submitReview(review: any, attachments: File[] = []) {

  // 1️⃣ Insert review FIRST (no files yet)
  const { data, error } = await supabase
    .from('reviews')
    .insert([{ ...review, files: [] }])
    .select()
    .single();

  if (error) throw error;

  const uploadedFiles: string[] = [];

  // 2️⃣ Upload files using review.id
  for (const file of attachments) {
    const path = `reviews/${data.contractor_id}/${data.id}/${Date.now()}-${file.name}`;

    const { error: upErr } = await supabase.storage
      .from('Images')
      .upload(path, file);

    if (upErr) throw upErr;

    const { data: publicUrl } = supabase.storage
      .from('Images')
      .getPublicUrl(path);

    uploadedFiles.push(publicUrl.publicUrl);
  }

  // 3️⃣ Update review with files array
  if (uploadedFiles.length) {
    const { error: updateErr } = await supabase
      .from('reviews')
      .update({ files: uploadedFiles })
      .eq('id', data.id);

    if (updateErr) throw updateErr;
  }

  return data;
}



  async myReviews(userId: string) {
    const { data, error } = await supabase.from('reviews')
      .select('*').eq('contractor_id', userId).order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }
  async getServices() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  }
  
  // updateReview function
async updateReview(id: string, updates: any) {
  const { data, error } = await supabase
    .from('reviews')
    .update(updates)
    .eq('id', id)
    .select('*'); // explicitly select all columns

  if (error) throw error;

  if (!data || data.length === 0) {
    console.warn('No row updated');
    return null;
  }

  return data[0];
}



async deleteReview(reviewId: number) {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId);

  if (error) throw error;
  return true;
}

async getStates() {
  const { data, error } = await supabase
    .from('states')
    .select('code, name, enabled')
    .order('name', { ascending: true });

  if (error) throw error;

  // Filter enabled
  return data?.filter((s: any) => s.enabled) || [];
}

async getUserReviewCount(userId: string) {
  //console.log('Debug: getUserReviewCount called for userId:', userId);

  const { data, error, count } = await supabase
  .from('reviews')
  .select('*', { count: 'exact' }) // get exact count
  .eq('contractor_id', userId)
  .eq('status', 'published');

  if (error) {
    //console.error('Supabase error fetching review count:', error);
    throw error;
  }

  //console.log('Debug: Supabase returned count:', count);
  //console.log('Debug: Supabase returned data:', data);

  return count || 0;
}

async fetchUserBadge(userId: string) {
  const reviewCount = await this.getUserReviewCount(userId);
  console.log('Debug: User review count:', reviewCount);

  // Fetch badges
  const { data: badges, error } = await supabase
    .from('review_badges')
    .select('*')
    .order('min_reviews', { ascending: true });

  if (error) {
     throw error;
  }

  

  // Find badge for current review count
  const badge = badges?.find(
    b => reviewCount >= b.min_reviews && reviewCount <= b.max_reviews
  );

  

  return badge;
}




}
