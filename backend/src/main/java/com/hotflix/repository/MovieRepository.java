package com.hotflix.repository;

import com.hotflix.dto.MovieDetail;
import com.hotflix.dto.MovieSummary;
import com.hotflix.model.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MovieRepository extends JpaRepository<Movie, Long> {

    @Query(
            value = """
                    select new com.hotflix.dto.MovieSummary(
                        m.id, m.title, m.year, m.genre, m.posterUrl, avg(r.rating),
                        case when count(f.id) > 0 then true else false end
                    )
                    from Movie m
                    left join Review r on r.movie = m
                    left join Favorite f on f.movie = m
                    where (:search = '' or lower(m.title) like lower(concat('%', :search, '%')))
                      and (:genre = '' or m.genre = :genre)
                    group by m.id, m.title, m.year, m.genre, m.posterUrl
                    """,
            countQuery = """
                    select count(m)
                    from Movie m
                    where (:search = '' or lower(m.title) like lower(concat('%', :search, '%')))
                      and (:genre = '' or m.genre = :genre)
                    """
    )
    Page<MovieSummary> findSummaries(
            @Param("search") String search,
            @Param("genre") String genre,
            Pageable pageable
    );

    @Query("""
            select new com.hotflix.dto.MovieDetail(
                m.id, m.title, m.year, m.genre, m.posterUrl, avg(r.rating),
                case when count(f.id) > 0 then true else false end,
                m.synopsis, m.durationMin, m.director, count(r.id)
            )
            from Movie m
            left join Review r on r.movie = m
            left join Favorite f on f.movie = m
            where m.id = :id
            group by m.id, m.title, m.year, m.genre, m.posterUrl,
                     m.synopsis, m.durationMin, m.director
            """)
    Optional<MovieDetail> findDetailById(@Param("id") Long id);

    @Query("""
            select new com.hotflix.dto.MovieSummary(
                m.id, m.title, m.year, m.genre, m.posterUrl, avg(r.rating), true
            )
            from Movie m
            join Favorite f on f.movie = m
            left join Review r on r.movie = m
            group by m.id, m.title, m.year, m.genre, m.posterUrl
            order by m.title
            """)
    List<MovieSummary> findFavoriteSummaries();

    @Query("select distinct m.genre from Movie m order by m.genre")
    List<String> findDistinctGenres();
}
