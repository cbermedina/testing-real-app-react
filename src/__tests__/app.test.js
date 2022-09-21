import React from 'react';
import { render, fireEvent, wait, screen, waitForElement, waitForElementToBeRemoved } from '@testing-library/react';
import App from '../App';
import { act } from 'react-dom/test-utils';


const empty_movie= {
    title: '',
    description: '',
};

const movies = [{
        id: 3,
        title: 'This is my first movie',
        description: 'and this is longer description 1',
    },
    {
        id: 4,
        title: 'This is my second movie',
        description: 'and this is longer description 2',
    }
];

describe('App component', () => {
    test('Should display and hide loading',async () => {
        jest.spyOn(global, 'fetch').mockImplementationOnce(()=>
            Promise.resolve({
                json: ()=> Promise.resolve(movies)
            })
        );
        act(()=>{
            render(<App />);
        });
        expect(screen.getByText("Loading...")).toBeTruthy();
        await waitForElement(()=> screen.getAllByTestId("list"));
        expect(screen.queryByText(/"Loading..."/i)).toBeFalsy();
    })

    test('Should display an error on bad request',async () => {
        jest.spyOn(global, 'fetch').mockImplementationOnce(()=>
            Promise.resolve({
                Status: 500,
            })
        );
        act(()=>{
            render(<App />);
        });

        await waitForElementToBeRemoved(()=> screen.getByText("Loading..."));
        expect(screen.getByText("Error loading movies")).toBeTruthy();
    })

    test('Should display list of movies after API request',async () => {
        jest.spyOn(global, 'fetch').mockImplementationOnce(()=>
            Promise.resolve({
                json: ()=> Promise.resolve(movies)
            })
        );
        act(()=>{
            render(<App />);
        });
        await waitForElementToBeRemoved(()=> screen.getByText("Loading..."));
        const list = screen.getByTestId("list");
        expect(list).toBeTruthy();
        expect(list.children.length).toBe(2)
    })

    test('Should display new movie btn and trigger form',async () => {
        jest.spyOn(global, 'fetch').mockImplementationOnce(()=>
            Promise.resolve({
                json: ()=> Promise.resolve(movies)
            })
        );
        act(()=>{
            render(<App />);
        });

        await waitForElementToBeRemoved(()=> screen.getByText("Loading..."));
        const btn = screen.getByRole("button",{name:'New movie'});
        fireEvent.click(btn);

        await wait(()=>{
            expect(screen.getAllByTestId('movie-form')).toBeTruthy();
        });
    })

    test('Should display movie ditails when clicked on heading',async () => {
        jest.spyOn(global, 'fetch').mockImplementationOnce(()=>
            Promise.resolve({
                json: ()=> Promise.resolve(movies)
            })
        );
        act(()=>{
            render(<App />);
        });

        await waitForElementToBeRemoved(()=> screen.getByText("Loading..."));
        const headings = screen.getAllByTestId("heading");
        fireEvent.click(headings[0]);

        await wait(()=>{
            expect(screen.getByText(movies[0].description)).toBeTruthy();
        });

        fireEvent.click(headings[1]);

        await wait(()=>{
            expect(screen.queryByText(movies[0].description)).toBeFalsy();
            expect(screen.getByText(movies[1].description)).toBeTruthy();
        });
    })
})
