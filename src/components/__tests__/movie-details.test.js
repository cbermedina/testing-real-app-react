import React from 'react';
import { render, fireEvent } from '@testing-library/react';
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
        const { getByTestId } = render(<MovieDetails movie={selectedMovie}/>);
        expect(getByTestId('no_rating').innerHTML).toBe(`(${selectedMovie.no_of_ratings})`);
    })

    test('mouseover Should hihlight the starts', () => {
        const { container } = render(<MovieDetails movie={selectedMovie}/>);
        const starts = container.querySelectorAll('.rate-container svg');
        starts.forEach((start, index) =>{
            fireEvent.mouseOver(start);
            const hihlight_starts = container.querySelectorAll('.purple');
            expect(hihlight_starts.length).toBe(index+1);
        });
    })

    test('mouseleave Should hihlight the starts', () => {
        const { container } = render(<MovieDetails movie={selectedMovie}/>);
        const starts = container.querySelectorAll('.rate-container svg');
        starts.forEach((start) =>{
            fireEvent.mouseOver(start);
            fireEvent.mouseOut(start);
            const hihlight_starts = container.querySelectorAll('.purple');
            expect(hihlight_starts.length).toBe(0);
        });
    })

    test('click stars should trigger rating function to update', () => {
        const loadMovie = jest.fn();
        const { container } = render(<MovieDetails movie={selectedMovie} updateMovie={loadMovie}/>);
        const stars = container.querySelectorAll('.rate-container svg');
        stars.forEach(star =>{
            fireEvent.click(star);
        });
        setTimeout(() =>{
            expect(loadMovie).toBeCalledTimes(stars.length);
        });
    })
})
