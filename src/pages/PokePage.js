import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPokemons, setFilter, setFilteredPokemons } from '../store/pokemonSlice';

const PokePage = () => {
  const dispatch = useDispatch();
  const { pokemons, filteredPokemons, status, filter } = useSelector((state) => state.pokemon);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPokemons());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (filter === 'all') {
      dispatch(setFilteredPokemons(pokemons))
    } else {
      dispatch(
        setFilteredPokemons(
          pokemons.filter((pokemon) => pokemon.types.includes(filter))
        )
      );
    }
  }, [filter, pokemons, dispatch])

  if(status === 'loading') {
    return <p>loading pokemons...</p>
}

if(status === 'failed') {
    return <p>Failed to load pokemons. Please try again.</p>
}

  const handleFilterChange = (e) => {
    dispatch(setFilter(e.target.value))
  };

  return (
    <div>
      <label>Filter</label>
      <select onChange={handleFilterChange} value={filter}>
        <option value="all">All</option>
        <option value="fire">Fire</option>
        <option value="water">Water</option>
        <option value="electric">Electric</option>
      </select>

      <div>
        {status === 'succeeded' && (
          <div className="pokemon-cards">
            {filteredPokemons.map((pokemon) => (
              <div key={pokemon.name} className="pokemon-card">
                <h3>{pokemon.name}</h3>
                <img src={pokemon.image} alt={pokemon.name} className="pokemon-image" />
                <p>Types: {pokemon.types.join(', ')}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default  PokePage;