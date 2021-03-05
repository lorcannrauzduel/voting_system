// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.6.11;
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

/**
 * @title Voting
 * @dev Smart contract de vote
 */
contract Voting is Ownable {

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    event VoterRegistered(address voterAddress);
    event ProposalsRegistrationStarted();
    event ProposalsRegistrationEnded();
    event ProposalRegistered(uint proposalId);
    event VotingSessionStarted();
    event VotingSessionEnded();
    event Voted (address voter, uint proposalId);
    event VotesTallied();
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);

    uint public winningProposalId; 
    uint endRegistrationDate;
    uint endVoteDate; 

    mapping(address => bool) public whitelist;
    mapping(address => Voter) public voters;
    
    WorkflowStatus public votingStatus;
    Proposal[] public proposals;

    /**
     * @dev Vérifie si l'utilisateur est enregistré
     */
    modifier registred {
        require(whitelist[msg.sender] = true, "Vous n'êtes pas enregistré sur la liste blanche");
        _;
    }
    
    /**
     * @dev Ajouter un électeur à la liste blanche
     * @param voterAddress Adresse du votant
     */
    function addWhiteList(address voterAddress) public onlyOwner {
        require(!whitelist[voterAddress], "Utilisateur déjà enregistré");
        whitelist[voterAddress] = true;
        voters[msg.sender] = Voter(true, false, 0);
        votingStatus = WorkflowStatus.RegisteringVoters;
        emit WorkflowStatusChange(WorkflowStatus.VotesTallied, WorkflowStatus.RegisteringVoters);
        emit VoterRegistered(voterAddress);
    }

    /**
     * @dev Démarrer la session d'enregistrement des propositions
     * @param CoolDown Durée de la session d'enregistrement
     */
    function startProposalsRegistration(uint CoolDown) public onlyOwner returns(uint){
        require(votingStatus == WorkflowStatus.RegisteringVoters, "Les électeurs n'ont pas été enregistrés");
        endRegistrationDate = block.timestamp + CoolDown;
        votingStatus = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
        addProposal("Plus de propositions"); 
        emit ProposalsRegistrationStarted();
        return endRegistrationDate;
    }

    /**
     * @dev Ajouter une proposition
     * @param description Description de la proposition
     */
    function addProposal(string memory description) public registred {
        require(votingStatus == WorkflowStatus.ProposalsRegistrationStarted, "La session d'enregistrement des propositions n'a pas commencé");
        require(block.timestamp < endRegistrationDate, "La session d'enregistrement des propositions est terminé");
        proposals.push(Proposal(description,0));
        uint id = proposals.length-1; 
        emit ProposalRegistered(id);
    }

    /**
     * @dev Mettre fin à la session d'enregistrement des propositions
     */
    function closeProposalsRegistration() public onlyOwner {
        require(votingStatus == WorkflowStatus.ProposalsRegistrationStarted, "La session d'enregistrement des propositions n'a pas commencé");
        require(block.timestamp >= endRegistrationDate, "La session d'enregistrement des propositions n'est pas terminé");
        votingStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
        emit ProposalsRegistrationEnded();
    }

    /**
     * @dev Démarrer la session de vote
     * @param Cooldown Durée de la session d'enregistrement
     * @return uint Nombre de vote 
     */
    function startVotingSession(uint Cooldown) public onlyOwner returns(uint){
        require(votingStatus == WorkflowStatus.ProposalsRegistrationEnded, "La session d'enregistrement des propositions n'est pas terminée");
        endVoteDate = block.timestamp + Cooldown;
        votingStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
        emit VotingSessionStarted();
        return endVoteDate;
    }

    /**
     * @dev Voter pour une proposition
     * @param _proposalId ID de la proposition
     * @return uint Nombre de vote 
     */
    function addVote(uint _proposalId) public returns (uint){
        require(votingStatus == WorkflowStatus.VotingSessionStarted, "La session de vote n'a pas commencé");
        require(voters[msg.sender].hasVoted == false, "Vous avez déjà voté");
        proposals[_proposalId].voteCount++;
        voters[msg.sender] = Voter(true, true, _proposalId);
        emit Voted (msg.sender, _proposalId);
        return proposals[_proposalId].voteCount;
    }

    /**
     * @dev Mettre fin à la session de vote
     */
    function closeVotingSession() public onlyOwner {
        require(block.timestamp >= endVoteDate, "La session de vote n'est pas terminée");
        require(votingStatus == WorkflowStatus.VotingSessionStarted, "La session de vote n'a pas commencé");
        votingStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
        emit VotingSessionEnded();
    }
    
    /**
     * @dev Comptabilise les votes pour récupérer la proposition gagnante
     * @return _proposalId ID de la proposition gagnante
     */
    function getWinningProposal() public onlyOwner returns (uint _proposalId) {
        uint winnerVoteCount = 0;
        uint challenger = 0;
        for (uint i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > winnerVoteCount) {
                winnerVoteCount = proposals[i].voteCount;
                _proposalId = i;
            } else if (proposals[i].voteCount == winnerVoteCount) {
                challenger = i;
            }
        }

        if(_proposalId == challenger) {
            return winningProposalId = 0;
        }

        return winningProposalId = _proposalId;
    }
            
    /**
     * @dev Récupère les informations concernant la proposition gagnante
     * @return description Description de la proposition
     * @return voteCount Nombre de vote 
     */
    function getWinningInfo() public view returns (string memory description, uint voteCount) {
        require(winningProposalId != 0, "Les votes n'ont pas encore été comptabilisés");
        return (proposals[winningProposalId].description, proposals[winningProposalId].voteCount);
    }
}