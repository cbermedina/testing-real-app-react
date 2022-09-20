import React from 'react';
import { render, fireEvent, wait, screen } from '@testing-library/react';
import MovieForm from '../movie-form';


const empty_movie= {
    title: '',
    description: '',
};

const movie = {
    id: 3,
    title: 'This is my first movie',
    description: 'and this is longer description',
};

describe('MovieForm component', () => {
    test('Should have form elements', () => {
        const { getByLabelText, getByRole } = render(<MovieForm movie={empty_movie} />);
        expect(getByLabelText(/Title/i)).toBeTruthy();
        expect(getByRole('button',{name:/create/i})).toBeTruthy();
    })

    test('Should display form elements with movie data', () => {
        const { getByLabelText, getByRole } = render(<MovieForm movie={movie} />);
        expect(getByLabelText(/title/i).value      ).toBe(movie.title);
        expect(getByRole('button',{name:/update/i})).toBeTruthy();
    })

    test('Should trigger API request when click the button', async () => {
        const udpatedMovie = jest.fn();
        jest.spyOn(global, 'fetch').mockImplementationOnce(()=>
            Promise.resolve({
                json: ()=> Promise.resolve(movie)
            })
        );
        const { getByRole } = render(<MovieForm movie={movie} udpatedMovie={udpatedMovie} />);
        const sutmitButton = getByRole('button', { name:/update/i});
        fireEvent.click(sutmitButton);
        await wait(()=>{
            expect(udpatedMovie).toBeCalledTimes(1);
        })
        global.fetch.mockClear()
    })

    test("Shouldn't trigger API request when clicked the button with empty form", async () => {
        const udpatedMovie = jest.fn();
        jest.spyOn(global, 'fetch').mockImplementationOnce(()=>
            Promise.resolve({
                json: ()=> Promise.resolve(movie)
            })
        );
        const { getByRole } = render(<MovieForm movie={empty_movie} udpatedMovie={udpatedMovie} />);
        const sutmitButton = getByRole('button', { name:/create/i});
        fireEvent.click(sutmitButton);
        await wait(()=>{
            expect(udpatedMovie).toBeCalledTimes(0);
        })
    })

    test("Should trigger API request when clicked on a new movie btn", async () => {
        const movieCreated = jest.fn();
        jest.spyOn(global, 'fetch').mockImplementationOnce(()=>
            Promise.resolve({
                json: ()=> Promise.resolve(movie)
            })
        );
        const { getByRole,  } = render(<MovieForm movie={empty_movie} movieCreated={movieCreated} />);
        const sutmitButton = getByRole('button', { name:/create/i});
        const titleInput = screen.getByLabelText(/title/i);
        const descInput = screen.getByLabelText(/Description/i);
        fireEvent.change(titleInput, {target: {value: "Title1" }})
        fireEvent.change(descInput, {target: {value: "Description2" }})
        fireEvent.click(sutmitButton);
        await wait(()=>{
            console.log(movieCreated.mock.calls)
            expect(movieCreated.mock.calls[0][0]).toStrictEqual(movie);// One way to validate
            expect(movieCreated).toBeCalledWith(movie);// Another way to validate
        })
    })
})
