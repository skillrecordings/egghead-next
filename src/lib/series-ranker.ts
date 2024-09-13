import {pgQuery} from '@/db'

export async function getPlaylistRankings() {
  return await pgQuery(`with 

      series_ratings as (
        select
          avg(case when rating is null then 4 else rating end) AS rating,
          -- avg(rating) as rating,
          count(case when rating is null then 1 else rating end) as number_of_ratings,
          playlists.title,
          playlists.id as series_id
        from ratings
        left join playlists on ratings.rateable_id = playlists.id
        where playlists.visibility_state = 'indexed' and playlists.site = 'egghead.io'
        group by playlists.id
        order by rating desc
      ),
      
      completions as (
        -- completions make a lot more sense from the series_progress vantage
        -- over the lesson view approach
        select
          playlists.id as playlist_id,
          count(1) as starts,
          sum(case when series_progresses.is_complete then 1 else 0 end) as completions
        from
          series_progresses
          inner join playlists on progressable_id = playlists.id and progressable_type = 'Playlist'
        where
          playlists.visibility_state = 'indexed' and playlists.site = 'egghead.io'
        group by playlists.id
      ),
      
      series_ages as (
        select
          id as playlist_id,
          now()::date - published_at::date as age
        from
          playlists
        where
          published_at is not null and  visibility_state = 'indexed' and site = 'egghead.io'
      ),
      
      series_update_ages as (
        select
          id as playlist_id,
          now()::date - updated_at::date as age
        from
          playlists
        where
          updated_at is not null and  visibility_state = 'indexed' and site = 'egghead.io'
      )
      select
        coalesce(review_weight,0.0) + coalesce(age_weight,0.0) + coalesce(updated_weight,0.0) + coalesce(completion_weight,0.0) as weight,
        *
      from (
          select 
            id,
            playlists.title as title,
          -- below is a super simple "bayesian" ranking, but has potential to expand into more like:
          -- https://www.analyticsvidhya.com/blog/2019/07/introduction-online-rating-systems-bayesian-adjusted-rating/
          -- it attempts to balance the number of reviews with the score
          -- so something with a 1 review of 1 isn't going to be rated as low
          -- as something with 11 reviews of 3
            coalesce(((((120*6.18) + (series_ratings.number_of_ratings * series_ratings.rating) ) / (120 + series_ratings.number_of_ratings)) / 7)::numeric, 0.42) as review_weight,
          -- newer content has more age weight
            (((select max(series_ages.age) from series_ages) - series_ages.age) / (select max(series_ages.age) from series_ages)::numeric)::numeric as age_weight,
          -- is "updated" useful?
            (((select max(series_update_ages.age) from series_update_ages) - series_update_ages.age) / (select max(series_update_ages.age) from series_update_ages)::numeric)::numeric as updated_weight,
            coalesce(((select max(completions.completions) from completions) - completions.completions) / (select max(completions.starts) from completions)::numeric, 0.23)::numeric as completion_weight,
            (completions.completions::numeric / completions.starts::numeric)::numeric  as completed_ratio,
            series_ratings.rating,
            series_ratings.number_of_ratings,
            completions.starts,
            completions.completions,
            slug,
            row_order
          from playlists
          left join series_ages on series_ages.playlist_id = playlists.id
          left join series_update_ages on series_update_ages.playlist_id = playlists.id
          -- this was an inner join, but that removes everything without a rating. 
          -- "left join" doesn't filter out rows that don't have a corresponding entry
          left join series_ratings on series_ratings.series_id = playlists.id
          left join completions on completions.playlist_id = playlists.id
          where playlists.visibility_state = 'indexed' and playlists.site = 'egghead.io'
      ) x
      order by weight desc`).then((result) => result.rows)
}
