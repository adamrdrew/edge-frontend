import React from 'react';
import PropTypes from 'prop-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import Modal from '../../components/Modal';
import {
  createGroup,
  addDevicesToGroup,
  validateGroupName,
} from '../../api/groups';
import { nameValidator } from '../../utils';
import apiWithToast from '../../utils/apiWithToast';
import { useDispatch } from 'react-redux';

const asyncGroupNameValidation = async (value = '') => {
  // do not fire validation request for empty name
  if (value.length === 0) {
    return undefined;
  }
  const resp = await validateGroupName(value);
  if (resp.data.isValid) {
    // async validator has to throw error, not return it
    throw 'Group name already exists';
  }
};

const validatorMapper = {
  groupName: () => asyncGroupNameValidation,
};

const createGroupSchema = {
  fields: [
    {
      component: componentTypes.TEXT_FIELD,
      name: 'name',
      label: 'Group name',
      helperText:
        'Can only contain letters, numbers, spaces, hyphens ( - ), and underscores( _ ).',
      isRequired: true,
      autoFocus: true,
      validate: [
        // async validator has to be first in the list
        { type: 'groupName' },
        { type: validatorTypes.REQUIRED },
        { type: validatorTypes.MAX_LENGTH, threshold: 50 },
        nameValidator,
      ],
    },
  ],
};

const CreateGroupModal = ({
  isModalOpen,
  setIsModalOpen,
  deviceIds,
  reloadData,
}) => {
  const dispatch = useDispatch();

  const handleCreateGroup = (values) => {
    const statusMessages = {
      onSuccess: {
        title: 'Success',
        description: `${values.name} has been created successfully`,
      },
      onError: { title: 'Error', description: 'Failed to create group' },
    };
    return apiWithToast(dispatch, () => createGroup(values), statusMessages);
  };

  const handleAddDevicesToNewGroup = async (values) => {
    const { ID } = await handleCreateGroup(values);

    const statusMessages = {
      onSuccess: {
        title: 'Success',
        description: `System(s) have been added to ${values.name} successfully`,
      },
      onError: { title: 'Error', description: 'Failed to add system to group' },
    };

    apiWithToast(
      dispatch,
      () => addDevicesToGroup(parseInt(ID), deviceIds),
      statusMessages
    );
  };

  return (
    <Modal
      isOpen={isModalOpen}
      closeModal={() => setIsModalOpen(false)}
      title="Create group"
      submitLabel="Create"
      schema={createGroupSchema}
      onSubmit={deviceIds ? handleAddDevicesToNewGroup : handleCreateGroup}
      reloadData={reloadData}
      validatorMapper={validatorMapper}
    />
  );
};

export default CreateGroupModal;

CreateGroupModal.propTypes = {
  isModalOpen: PropTypes.bool,
  setIsModalOpen: PropTypes.func,
  reloadData: PropTypes.func,
  deviceIds: PropTypes.array,
};
