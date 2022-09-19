import React from 'react';
import { render } from '@testing-library/react';
import MovieDetails from '../movie-details';

const selectedMovie={
    id:1,
    title:"Some title",
    description: "Some description",
    no_of_ratings:2,
    avg_rating:3
};

describe('MovieDetails component', () => {
    test('Should match a snapshot', () => {
        const { container } = render(<MovieDetails movie={selectedMovie}/>);
        expect(container).toMatchSnapshot();
    })

    test('Should be display the title', () => {
        const { queryByText } = render(<MovieDetails movie={selectedMovie}/>);
        expect(queryByText(selectedMovie.title)).toBeTruthy();
    })

    test('Should be display the description', () => {
        const { queryByText } = render(<MovieDetails movie={selectedMovie}/>);
        expect(queryByText(selectedMovie.description)).toBeTruthy();
    })

    test('Should be display color starts', () => {
        const { container } = render(<MovieDetails movie={selectedMovie}/>);
        const selectedStarts = container.querySelectorAll('.orange');
        expect(selectedStarts.length).toBe(selectedMovie.avg_rating);
    })

    test('Should be display number of ratings', () => {
        const { getByText } = render(<MovieDetails movie={selectedMovie}/>);
     
    })
})
