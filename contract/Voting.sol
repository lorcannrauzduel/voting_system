// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.6.11;
pragma experimental ABIEncoderV2;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract Voting is Ownable {
    // @dev


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

    mapping(address => bool) public whitelist; //liste blanche des adresses pouvant particper au vote
    mapping(address => Voter) public voters;  //pointeur pour identifier l'adresse d'un votant
    

    uint winingProposalId; //variable contenant l'ID de la proposition adoptée
    WorkflowStatus votingStatus; //variable contenant l'étape du processus de vote
    Proposal[] public proposals; //tableau dynamique des propositions
    uint RegistrationPeriod; //variable contenant la date de fin d'enregistrement de propositions
    uint voteDate; //variable contenant la date de fin d'enregistrement de votes

    modifier registred {        //modifier n'authorisant que les adresses de la liste blanche
        require(whitelist[msg.sender] = true, "Not registred");
        _;
    }

    

    function addWhiteList(address voterAddress) public onlyOwner {  //fonction d'ajout par adresse à la liste blanche
        require(!whitelist[voterAddress], "already whitelisted"); //bloque les adresses déjà listées
        //require(votingStatus ==  0, "Vote isn't initialized");
        whitelist[voterAddress] = true;
        voters[msg.sender] = Voter(true, false, 0);
        votingStatus = WorkflowStatus.RegisteringVoters;
        emit WorkflowStatusChange(WorkflowStatus.VotesTallied, WorkflowStatus.RegisteringVoters);
        emit VoterRegistered(voterAddress);
    }


    function proposalRegistration(uint CoolDown) public onlyOwner returns(uint){ //fonction d'ouverture de la session d'enregistrement des propositions
        require(votingStatus == WorkflowStatus.RegisteringVoters, "voters are not registred");
        RegistrationPeriod = block.timestamp + CoolDown; //Definition de la date de cloture de la session d'enregistrement, cooldown (=secondes)
        votingStatus = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
        proposalSuggestion("0"); // la proposition avec l'id 0 est créee et ne contient aucune proposition valable pour le vote
        emit ProposalsRegistrationStarted();
        return RegistrationPeriod;
    }

    function proposalSuggestion(string memory description) public registred { //fonction d'enregistrement d'une proposition
        require(votingStatus == WorkflowStatus.ProposalsRegistrationStarted, "the proposal Registration is not started");
        require(block.timestamp < RegistrationPeriod, "the proposals suggestions are closed");
        proposals.push(Proposal(description,0)); // création de la propostion avec une description écrite et total de vote initialisé à 0
        uint id = proposals.length-1; //id dynamique indexant la propostion créee
        emit ProposalRegistered(id);
    }

    function closeRegistration() public onlyOwner {
        require(votingStatus == WorkflowStatus.ProposalsRegistrationStarted, "the proposal Registration is not started");
        require(block.timestamp >= RegistrationPeriod, "still time to make proposals");
        votingStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
        emit ProposalsRegistrationEnded();
    }

    function openVote(uint Cooldown) public onlyOwner returns(uint){
        require(votingStatus == WorkflowStatus.ProposalsRegistrationEnded, "the proposal Registration isn't finished");
        voteDate = block.timestamp + Cooldown;
        votingStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
        emit VotingSessionStarted();
        return voteDate;
    }

    function vote(uint _proposalId) public returns (uint){
        require(votingStatus == WorkflowStatus.VotingSessionStarted, "the vote Registration is not started");
        require(voters[msg.sender].hasVoted == false, "already voted");
        proposals[_proposalId].voteCount++;
        voters[msg.sender] = Voter(true, true, _proposalId);
        emit Voted (msg.sender, _proposalId);
        return proposals[_proposalId].voteCount;
    }

    function closeVote() public onlyOwner {
        require(block.timestamp >= voteDate, "still time to vote");
        require(votingStatus == WorkflowStatus.VotingSessionStarted, "the vote Registration is not started");
        votingStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
        emit VotingSessionEnded();
    }

/*    
    function countingVote() public onlyOwner returns(uint){
        require(votingStatus == WorkflowStatus.VotingSessionEnded, "the vote Registration is not finished");
        uint i = 0;
        uint j = proposals.length-1;
        while (i!=j) {
            if (proposals[i].voteCount >= proposals[j].voteCount) {
                j--;
            } i++;
        }
        votingStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
        emit VotesTallied();
        return winingProposalId = i;
    }
*/
    
    function setWinningProposal(uint _proposalId) external onlyOwner returns(uint) {
        winingProposalId = _proposalId;
        return _proposalId;
    }
    
    function getVotingStatus() public view returns(WorkflowStatus) {
        return votingStatus;
    }
    
    function getProposalCount() public view returns(uint) {
        return proposals.length;
    }
    
    function getProposal(uint index) public view returns(uint, string memory, uint) {
        return (index, proposals[index].description, proposals[index].voteCount);
    }
}