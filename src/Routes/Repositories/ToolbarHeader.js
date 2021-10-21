import React from 'react';
import {
    Toolbar,
    Pagination,
    ToolbarItem,
    ToolbarContent,
    Button,
    InputGroup,
    TextInput,
} from '@patternfly/react-core';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';

const ToolbarButtons = ({ buttons }) => {
    return buttons.map(({ title, click }) => (
        <ToolbarItem>
            <Button onClick={click} variant='primary'>
                {title}
            </Button>
        </ToolbarItem>
    ));
};

const ToolbarHeader = ({
    toolbarButtons,
    setInput,
    count,
    perPage,
    setPerPage,
    page,
    setPage,
}) => {
    return (
        <Toolbar id='toolbar'>
            <ToolbarContent>
                <ToolbarItem>
                    <InputGroup>
                        <TextInput
                            name='textInput1'
                            id='textInput1'
                            type='search'
                            aria-label='search input example'
                            placeholder='Filter by name'
                            onChange={(value) => setInput(value)}
                        />
                        <Button
                            variant='control'
                            aria-label='search button for search input'
                        >
                            <SearchIcon />
                        </Button>
                    </InputGroup>
                </ToolbarItem>
                <ToolbarButtons buttons={toolbarButtons} />
                <ToolbarItem
                    variant='pagination'
                    align={{ default: 'alignRight' }}
                >
                    <Pagination
                        isCompact
                        itemCount={count}
                        perPage={perPage}
                        page={page}
                        onSetPage={(_e, pageNumber) => setPage(pageNumber)}
                        widgetId='pagination-options-menu-top'
                        onPerPageSelect={(_e, perPage) => setPerPage(perPage)}
                    />
                </ToolbarItem>
            </ToolbarContent>
        </Toolbar>
    );
};

export default ToolbarHeader;
